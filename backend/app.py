from flask import Flask, request, redirect, render_template, send_from_directory, jsonify, session, url_for
from config import requests_collection, ngo_collection, donation_collection
from bson.objectid import ObjectId
from datetime import datetime
import os
import uuid

app = Flask(
    __name__,
    template_folder="../templates",
    static_folder="../static"
)

app.secret_key = "helphub_secret_key"

UPLOAD_FOLDER = "../uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ================= HOME =================

@app.route("/")
def home():
    total = requests_collection.count_documents({})
    completed = requests_collection.count_documents({"status": "Completed"})
    return render_template("index.html", total=total, completed=completed)


# ================= POST REQUEST =================

@app.route("/request", methods=["GET", "POST"])
def request_help():

    if request.method == "POST":

        help_type = request.form.get("type")
        description = request.form.get("description")
        location = request.form.get("location")
        contact = request.form.get("contact")
        priority = request.form.get("priority")

        filename = ""

        photo = request.files.get("photo")

        if photo and photo.filename != "":
            ext = photo.filename.split(".")[-1]
            filename = str(uuid.uuid4()) + "." + ext
            photo.save(os.path.join(UPLOAD_FOLDER, filename))

        requests_collection.insert_one({
            "help_type": help_type,
            "description": description,
            "location": location,
            "contact": contact,
            "photo": filename,
            "priority": priority,
            "status": "Pending",
            "createdAt": datetime.utcnow()
        })

        return redirect("/dashboard")

    return render_template("request_help.html")


# ================= USER DASHBOARD =================

@app.route("/dashboard")
def dashboard():

    data = list(requests_collection.find().sort("createdAt", -1))
    return render_template("dashboard.html", data=data)


# ================= ACCEPT HELP =================

@app.route("/accept/<id>")
def accept(id):

    try:
        requests_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": "Completed"}}
        )
    except:
        pass

    return redirect(request.referrer or "/dashboard")


# ================= NGO LOGIN =================

@app.route("/ngo-login", methods=["GET", "POST"])
def ngo_login():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")

        ngo = ngo_collection.find_one({
            "email": email,
            "password": password
        })

        if ngo:
            session["ngo"] = str(ngo["_id"])
            return redirect("/ngo-dashboard")

    return render_template("ngo_login.html")


# ================= NGO DASHBOARD =================

@app.route("/ngo-dashboard")
def ngo_dashboard():

    if "ngo" not in session:
        return redirect("/ngo-login")

    data = list(requests_collection.find().sort("createdAt", -1))

    return render_template("ngo_dashboard.html", data=data)


# ================= NGO ACCEPT =================

@app.route("/ngo-accept/<id>")
def ngo_accept(id):

    if "ngo" not in session:
        return redirect("/ngo-login")

    requests_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "status": "Completed",
            "handledByNGO": True
        }}
    )

    return redirect("/ngo-dashboard")


# ================= DONATION =================

@app.route("/donate", methods=["GET", "POST"])
def donate():

    if request.method == "POST":

        donation_collection.insert_one({
            "name": request.form.get("name"),
            "item": request.form.get("item"),
            "amount": request.form.get("amount"),
            "createdAt": datetime.utcnow()
        })

        return redirect("/analytics")

    return render_template("donate.html")


# ================= ANALYTICS =================

@app.route("/analytics")
def analytics():

    total = requests_collection.count_documents({})
    completed = requests_collection.count_documents({"status": "Completed"})
    animals = requests_collection.count_documents({"help_type": "Animal Rescue"})
    ngos = ngo_collection.count_documents({})
    donations = donation_collection.count_documents({})

    return render_template(
        "analytics.html",
        total=total,
        completed=completed,
        animals=animals,
        ngos=ngos,
        donations=donations
    )


# ================= API RECENT =================

@app.route("/api/recent")
def recent():

    data = list(requests_collection.find().sort("createdAt", -1).limit(3))

    result = []

    for d in data:
        result.append({
            "_id": str(d["_id"]),
            "help_type": d.get("help_type"),
            "location": d.get("location"),
            "photo": d.get("photo"),
            "status": d.get("status"),
            "priority": d.get("priority")
        })

    return jsonify(result)


# ================= API ALL (MAP) =================

@app.route("/api/all")
def all_requests():

    data = list(requests_collection.find().sort("createdAt", -1))

    result = []

    for d in data:
        result.append({
            "_id": str(d["_id"]),
            "help_type": d.get("help_type"),
            "location": d.get("location"),
            "photo": d.get("photo"),
            "status": d.get("status"),
            "priority": d.get("priority")
        })

    return jsonify(result)


# ================= API COUNT =================

@app.route("/api/count")
def count():
    total = requests_collection.count_documents({})
    return jsonify({"count": total})


# ================= SERVE IMAGE =================

@app.route("/uploads/<filename>")
def uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ================= RUN =================

if __name__ == "__main__":
    app.run(debug=True)