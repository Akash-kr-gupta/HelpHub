from pymongo import MongoClient
import os

# ⭐ MongoDB URL
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    client.server_info()
    print("✅ MongoDB Connected Successfully")

except Exception as e:
    print("❌ MongoDB Connection Failed:", e)


# ⭐ Database
db = client["helphub"]


# ⭐ Collections (STANDARD NAMES — match app.py import)

users_collection = db["users"]

requests_collection = db["requests"]

ngo_collection = db["ngo_users"]          # ⭐ FIXED NAME

donation_collection = db["donations"]     # ⭐ FIXED NAME

notifications_collection = db["notifications"]

activity_collection = db["activity_logs"]