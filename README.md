
# 🚑 HelpHub — Social Emergency Network

[![Live Demo](https://img.shields.io/badge/Live_Demo-helphub--frontend--v7d9.onrender.com-brightgreen?style=for-the-badge)](https://helphub-frontend-v7d9.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend_API-helphub--backend--1awo.onrender.com-blue?style=for-the-badge)](https://helphub-backend-1awo.onrender.com)

HelpHub is a **real-time social emergency assistance platform** that connects people in need with volunteers, NGOs, and donors instantly.

It enables anyone to **request help** and anyone to **contribute**, creating a powerful community-driven support system.

---

## 🌍 Problem Statement

During emergencies like:

* 🩸 Blood requirements
* 🚑 Medical emergencies
* 🐶 Injured animals
* 🐾 Lost pets
* 🍱 Food assistance

People often struggle to find **immediate local help**.

👉 HelpHub solves this by providing a **location-based digital response network**.

---

## 🚀 Features

### 👤 User Features

* 🔐 Authentication (Login / Signup with roles)
* 📢 Post emergency requests
* 📍 Auto-detect live location (Map integration)
* 🖼 Upload images as proof (optional)
* 📊 Track request status (Pending / Completed)
* ⭐ View personal requests
* 👤 Profile dashboard

---

### 🤝 Volunteer Features

* 📋 View nearby emergency requests
* ✅ Accept and complete requests
* 🔔 Real-time notifications
* 🗺 Map-based request visualization

---

### 🏢 NGO Panel

* 🏢 Dedicated NGO dashboard
* 📋 View official emergency cases
* 🚨 Handle high-priority requests

---

### 💡 Social Impact Modules

* 🎁 Donation system
* 💬 Real-time chat
* 📊 Analytics dashboard

---

## 🧠 Tech Stack

### 🎨 Frontend (React + Vite)

* React.js (v18)
* Vite
* React Router v6
* React Leaflet + Leaflet.js
* Chart.js + React-Chartjs-2
* Framer Motion
* Socket.IO Client
* Axios

---

### ⚙️ Backend (Node.js + Express)

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO
* JWT Authentication
* Bcrypt
* Nodemailer
* Multer (File uploads)

---

## 📂 Project Structure

```
HelpHub/
│
├── backend_node/
│   ├── alert.js
│   ├── seed_ngos.js
│   ├── server.js
│   └── package.json
│
├── frontend_react/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Donate.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NGODashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Request.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── VolunteerDashboard.jsx
│   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Akash-kr-gupta/HelpHub.git
cd HelpHub
```

---

### 2️⃣ Setup Backend

```bash
cd backend_node
npm install
```

Create a `.env` file in `backend_node/` and add:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

For Render, add `MONGO_URI` in the backend service environment variables using the current MongoDB Atlas connection string. In Atlas, add the Render service network access rule required by your deployment (for a quick test, `0.0.0.0/0`, then restrict it for production). Keep `JWT_SECRET` stable across deploys so existing sessions remain valid.

Run backend:

```bash
npm run dev
# OR
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend_react
npm install
npm run dev
```

Open in browser:

👉 [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

* Backend + frontend configured using `render.yaml`
* Can be deployed easily on **Render / Railway / Vercel (frontend)**

---

## 🌟 Future Enhancements

* 📱 Progressive Web App (PWA)
* 💳 Online payment gateway
* 🧠 AI-based emergency prioritization
* 📡 SMS alert system
* 📍 Advanced geo-tracking

---

## ❤️ Vision

HelpHub aims to become a **national social emergency response platform** where technology empowers humanity.

> “Anyone can ask. Anyone can help.”

---

## 🤝 Contributors

* Akash Kumar Gupta
* Aditi Kumari

---

## 📜 License

This project is currently **open-source** and available for learning and contribution.

---
