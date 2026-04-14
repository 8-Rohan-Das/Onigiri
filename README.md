# 🍙 Onigiri – Online Food Ordering System

**Onigiri** is a modern **Online Food Ordering System** built with **React + Vite** that allows users to browse food items, add them to cart, and place orders through a smooth and responsive interface.

This project focuses on delivering a fast UI experience with a clean frontend architecture and scalable components.

---

## ✨ Features

### 👤 User Features
- 🍜 **Browse Food Menu**: Explore menu items with categories.
- 🔍 **Search & Filter**: Quickly find food items by name or category.
- 🛒 **Cart Management**: Add/remove items and update quantities in real-time.
- ❤️ **Favorites**: Mark items as favorites for quick access.
- 💳 **Checkout Flow**: Seamless order placement process.
- 📦 **Order Summary**: View current and past order details.
- 🔔 **Notifications**: Real-time status updates and action alerts.

### 🎨 UI/UX
- ⚡ **Vite Powered**: Extremely fast build and development experience.
- 📱 **Responsive Design**: Optimized for all screen sizes.
- 🧩 **Modular Components**: Reusable UI elements for high scalability.
- 🎬 **Smooth Animations**: Powered by Framer Motion.

---

## 📁 Project Structure

```
Onigiri/
├── front_end/           # React Frontend Application
│   ├── src/            # React source code
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state management
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Application pages (Home, Shop, Auth, User)
│   │   ├── utils/      # Utility functions
│   │   └── assets/     # Images and icons
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite configuration
│
├── back_end/           # Node.js Backend API
│   ├── models/         # Mongoose data models
│   ├── routes/         # Express API routes
│   ├── server.js       # Express server entry point
│   ├── .env            # Environment variables
│   └── package.json    # Backend dependencies
│
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

---

## 🧰 Tech Stack

- **Frontend:** React 19, Vite 7
- **Routing:** React Router 7
- **State Management:** Context API
- **Styling:** Bootstrap 5, Custom CSS
- **Animations:** Framer Motion 12
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose 8
- **Authentication:** Custom JWT-based flow

---

## 🚀 Getting Started

### ✅ Prerequisites
Make sure you have installed:
- **Node.js (v18+)**
- **npm**
- **MongoDB** (Local or Atlas)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Eonsoid/Onigiri.git
cd Onigiri
```

### 2️⃣ Run the Application

You can run both backend and frontend from the root directory:

#### **Frontend (React App)**
```bash
cd front_end
npm install
npm run dev
```
- Runs on: http://localhost:5173

#### **Backend (API Server)**
```bash
cd back_end
npm install
npm start
```
- Runs on: http://localhost:5000

---

## 🔗 API Endpoints

- `POST /api/login` - User authentication
- `POST /api/users` - User registration
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

---

## 📖 Further Documentation

For a detailed guide on how the application works internally, including state management and component breakdowns, please refer to:
- [ONIGIRI_DOCUMENTATION.md](./ONIGIRI_DOCUMENTATION.md)

---

## 📝 Developer Notes

- Frontend and Backend are completely decoupled.
- Each directory maintains its own dependencies in `package.json`.
- Environment variables should be configured in `back_end/.env`.
