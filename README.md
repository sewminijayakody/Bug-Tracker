## Issue Tracker Application

This is a simple Issue Tracker web application I built as part of a technical assignment. The goal of this project is to manage issues using full CRUD operations and provide a clean and user-friendly interface.

## What this app does

Users can:

- Register and log in securely
- Create new issues with title, description, priority, and severity
- View all issues in a dashboard
- Update issue details and change status
- Delete issues when needed
- Search issues by title
- Filter issues by status and priority
- See issue counts based on status (Open, In Progress, Resolved)
- Export issues as CSV or JSON

## Tech Stack

### Frontend

- React (Vite)
- CSS

### Backend

-Node.js
-Express.js

### Database

- MongoDB (Atlas)

## Other

JWT for authentication
bcrypt for password hashing

⚙️ How to run the project

1. Clone the project
   git clone https://github.com/sewminijayakody/Bug-Tracker.git
   cd Bug-Tracker

2. Setup backend
   cd backend
   npm install

3. Create a .env file in the backend folder:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=https://bug-tracker-frontend-coral.vercel.app

4. Create a .env file in the frontend folder:

VITE_API_URL=https://bug-tracker-cnvv.onrender.com/api

Run backend:
npm run dev

5. Setup frontend
   cd frontend
   npm install
   npm run dev

## App URLs

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Notes

- Each user can only see their own issues
- Passwords are securely hashed before storing
- JWT is used for authentication
- API requests are protected

## What I focused on

- Keeping the UI clean and easy to use
- Making sure all CRUD operations work properly
- Structuring the backend clearly
- Handling user authentication securely

## Future improvements

If I had more time, I would:

Improve UI design further
Add real-time updates
Add user roles (admin/user)
Improve validation and error handling

## Live Demo

**Frontend:** https://bug-tracker-frontend-coral.vercel.app/

**Backend:** https://bug-tracker-cnvv.onrender.com/

Author

Sewmini Jayakody
