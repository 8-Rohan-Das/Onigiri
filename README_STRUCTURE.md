# 🍱 Onigiri - Project Structure

## 📁 Organized Folder Structure

```
Onigiri/
├── front_end/           # React Frontend Application
│   ├── src/            # React source code
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state management
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Application pages
│   │   ├── utils/      # Utility functions
│   │   └── assets/     # Images and icons
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite configuration
│
├── back_end/           # Node.js Backend API
│   ├── models/         # Mongoose data models
│   ├── server.js       # Express server
│   ├── .env            # Environment variables
│   └── package.json    # Backend dependencies
│
├── .git/               # Git version control
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🚀 How to Run

### Frontend (React App)
```bash
cd front_end
npm install
npm run dev
```
- Runs on: http://localhost:5173

### Backend (API Server)
```bash
cd back_end
npm install
npm start
```
- Runs on: http://localhost:5000

## 📋 Technology Stack

### Frontend
- **React 19.2.0** - UI Framework
- **React Router 7.12.0** - Navigation
- **Bootstrap 5.3.8** - Styling
- **Framer Motion 12.28.1** - Animations
- **Vite 7.2.4** - Build Tool

### Backend
- **Node.js** - Runtime Environment
- **Express 5.2.1** - Web Framework
- **MongoDB with Mongoose 8.23.0** - Database
- **CORS 2.8.6** - Cross-Origin Resource Sharing

## 🔗 API Endpoints

- `POST /api/login` - User authentication
- `POST /api/users` - User registration
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## 🗄️ Database

- **MongoDB Atlas** - Cloud Database
- **Local MongoDB** - Development fallback

## 📝 Notes

- Frontend and Backend are now completely separated
- Each folder has its own package.json and dependencies
- Backend serves API on port 5000
- Frontend runs on port 5173 with Vite dev server
