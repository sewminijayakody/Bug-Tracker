# Issue Tracker Application

This is a simple Issue Tracker web application built as part of a technical assignment. The goal of this project is to manage issues using full CRUD operations while maintaining a clean and user-friendly interface.

---

## Features

Users can:

- Register and log in securely
- Create new issues with title, description, priority, and severity
- View all issues in a dashboard
- Update issue details and change status
- Delete issues
- Search issues by title
- Filter issues by status and priority
- View issue counts by status (Open, In Progress, Resolved)
- Export issues as CSV or JSON

---

## Tech Stack

### Frontend

- React (Vite)
- Zustand (State Management)
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Other

- JWT for authentication
- bcrypt for password hashing

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sewminijayakody/Bug-Tracker.git
cd Bug-Tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=https://bug-tracker-frontend-coral.vercel.app
```

Run the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=https://bug-tracker-cnvv.onrender.com/api
```

---

## App URLs

- Frontend (Local): http://localhost:5173
- Backend (Local): http://localhost:5000

---

## Live Demo

- Frontend: https://bug-tracker-frontend-coral.vercel.app/
- Backend API: https://bug-tracker-cnvv.onrender.com/

---

## Notes

- Each user can only access their own issues
- Passwords are securely hashed before storing
- JWT is used for authentication
- Protected API routes require a valid token

---

## Key Focus Areas

- Clean and user-friendly UI
- Proper implementation of CRUD operations
- Clear backend structure
- Secure authentication handling

---

## Future Improvements

If I had more time, I would:

- Improve UI design further
- Add real-time updates
- Implement user roles (admin/user)
- Enhance validation and error handling

---

## Author of the project

Sewmini Jayakody
