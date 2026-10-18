# Car & Bike Rental System

A full-stack web application for renting cars and bikes built with Node.js, Express, MongoDB, React, Vite, and Tailwind CSS.

## 🚀 Features

- **Vehicle Catalog**: Browse cars and bikes available for rent with detailed specifications and pricing.
- **User Authentication**: Secure JWT-based authentication (sign up, log in, protected routes).
- **Booking Management**: Book vehicles with date selection and rental calculation.
- **Modern UI**: Responsive, sleek design powered by Tailwind CSS and DaisyUI.
- **RESTful API**: Clean backend architecture with Express.js and Mongoose.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, DaisyUI, React Router v7, Axios, React Icons, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, CORS, Dotenv

## 📁 Project Structure

```text
car-bike-rental/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas)

### 2. Backend Setup
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. In a new terminal, navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:5173`.
