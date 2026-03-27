from flask import Flask, request, redirect, render_template, send_from_directory, jsonify, session, flash
from config import requests_collection, ngo_collection, donation_collection, users_collection
from bson.objectid import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os
import uuid

app = Flask(__name__,
            template_folder="../templates",
            static_folder="../static")

app.secret_key = "helphub_secret"

UPLOAD_FOLDER = "../uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ================= DECORATORS =================

def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            flash("Please login first")
            return redirect("/login")
        return f(*args, **kwargs)
    return wrapper


def ngo_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session or session.get("role") != "ngo":
            flash("NGO access only")
            return redirect("/dashboard")
        return f(*args, **kwargs)
    return wrapper


# ================= HOME =================

@app.route("/")
def home():
    total = requests_collection.count_documents({})
    completed = requests_collection.count_documents({"status": "Completed"})
    return render_template("index.html", total=total, completed=completed)


# ================= SIGNUP =================

@app.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "POST":

        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        role = request.form.get("role")

        if users_collection.find_one({"email": email}):
            flash("User already exists")
            return redirect("/signup")

        hashed = generate_password_hash(password)

        users_collection.insert_one({
            "name": name,
            "email": email,
            "password": hashed,
            "role": role,
            "createdAt": datetime.utcnow()
        })

        flash("Signup Successful")
        return redirect("/login")

    return render_template("signup.html")


# ================= LOGIN =================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")

        user = users_collection.find_one({"email": email})

        if not user:
            flash("User not found")
            return redirect("/login")

        if not check_password_hash(user["password"], password):
            flash("Wrong Password")
            return redirect("/login")

        session["user_id"] = str(user["_id"])
        session["role"] = user["role"]

        if user["role"] == "ngo":
            return redirect("/ngo-dashboard")

        return redirect("/dashboard")

    return render_template("login.html")


# ================= LOGOUT =================

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# ================= POST REQUEST =================

@app.route("/request", methods=["GET", "POST"])
@login_required
def request_help():

    if request.method == "POST":

        filename = ""
        photo = request.files.get("photo")

        if photo and photo.filename != "":
            ext = photo.filename.split(".")[-1]
            filename = str(uuid.uuid4()) + "." + ext
            photo.save(os.path.join(UPLOAD_FOLDER, filename))

        requests_collection.insert_one({
            "help_type": request.form.get("type"),
            "description": request.form.get("description"),
            "location": request.form.get("location"),
            "contact": request.form.get("contact"),
            "priority": request.form.get("priority"),
            "photo": filename,
            "status": "Pending",
            "createdBy": session["user_id"],
            "createdAt": datetime.utcnow()
        })

        flash("Request Posted")
        return redirect("/dashboard")

    return render_template("request_help.html")


# ================= DASHBOARD =================

@app.route("/dashboard")
@login_required
def dashboard():
    data = list(requests_collection.find().sort("createdAt", -1))
    return render_template("dashboard.html", data=data)


# ⭐ NEW FEATURE — MY REQUESTS (Ownership)

@app.route("/my-requests")
@login_required
def my_requests():

    data = list(requests_collection.find({
        "createdBy": session["user_id"]
    }).sort("createdAt", -1))

    return render_template("my_requests.html", data=data)


# ================= ACCEPT =================

@app.route("/accept/<id>")
@login_required
def accept(id):

    req = requests_collection.find_one({"_id": ObjectId(id)})

    if req and req.get("createdBy") != session["user_id"]:

        requests_collection.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "status": "Completed",
                    "completedBy": session["user_id"],
                    "completedAt": datetime.utcnow()
                }
            }
        )

    return redirect("/dashboard")


# ================= NGO DASHBOARD =================

@app.route("/ngo-dashboard")
@ngo_required
def ngo_dashboard():

    data = list(requests_collection.find().sort("createdAt", -1))
    return render_template("ngo_dashboard.html", data=data)

@app.route('/ngo/rescue-requests')
@login_required  # if you have login
def ngo_rescue_requests():
    # Sample data - replace with your database query
    all_requests = [
        {'id': 1, 'issue': 'Stray Dog - Broken Leg', 'location': 'Park Street', 'status': 'pending'},
        {'id': 2, 'issue': 'Cat - Injured Paw', 'location': 'Salt Lake', 'status': 'in_progress'},
        # Add more...
    ]
    return render_template('rescue_requests.html', requests=all_requests)

@app.route("/ngo-accept/<id>")
@ngo_required
def ngo_accept(id):

    requests_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "status": "Completed",
                "handledByNGO": True,
                "completedAt": datetime.utcnow()
            }
        }
    )

    return redirect("/ngo-dashboard")


# ================= DONATION =================

@app.route("/donate", methods=["GET", "POST"])
@login_required
def donate():

    if request.method == "POST":

        donation_collection.insert_one({
            "name": request.form.get("name"),
            "item": request.form.get("item"),
            "amount": request.form.get("amount"),
            "createdAt": datetime.utcnow()
        })

        flash("Donation Added")
        return redirect("/analytics")

    return render_template("donate.html")


# ================= ANALYTICS =================

@app.route("/analytics")
@login_required
def analytics():

    total = requests_collection.count_documents({})
    completed = requests_collection.count_documents({"status": "Completed"})
    ngos = users_collection.count_documents({"role": "ngo"})
    donations = donation_collection.count_documents({})

    return render_template(
        "analytics.html",
        total=total,
        completed=completed,
        ngos=ngos,
        donations=donations
    )
    
    
    
@app.route("/profile")
@login_required
def profile():

    user = users_collection.find_one({"_id": ObjectId(session["user_id"])})

    total = requests_collection.count_documents({
        "createdBy": session["user_id"]
    })

    completed = requests_collection.count_documents({
        "completedBy": session["user_id"]
    })

    return render_template(
        "profile.html",
        user=user,
        total_requests=total,
        completed_requests=completed
    )


# ================= API =================

@app.route("/api/count")
def count():
    total = requests_collection.count_documents({})
    return jsonify({"count": total})


@app.route("/uploads/<filename>")
def uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)