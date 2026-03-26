from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["helphub"]

requests_collection = db["requests"]
ngo_collection = db["ngo_users"]
donation_collection = db["donations"]