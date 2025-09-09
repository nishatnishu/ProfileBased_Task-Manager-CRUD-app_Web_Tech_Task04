Profile-Based Task Manager CRUD App – Web Tech Task 04
📌 Description

This project is an enhanced Task Manager Application built with Node.js, Express.js, and MySQL.
It introduces profile-based access control with authentication and authorization, ensuring that users can manage only their own tasks.

The app supports full CRUD operations, user registration/login, and role-based access (e.g., Admin vs User).

Developed as part of Web Tech – Task 04.

🚀 Features

User Authentication (JWT-based)
Secure user registration and login.
Passwords hashed with bcrypt.

Authorization
Role-based access control (admin & user).
Users can only access their own tasks.

MySQL Integration
Persistent storage using core SQL queries (no ORM).
Tables for Users and Tasks with proper relationships.

Task Management
Create, Read, Update, Delete tasks.
Filter tasks by status.
Associate tasks with the authenticated user.

Middleware
Authentication middleware for JWT verification.
Authorization middleware for role-based route protection.

Password Reset with Email Verification
Users can request password reset via email.
Token-based secure reset flow

Environment Config
.env file for DB credentials and JWT secret.

🛠️ Tech Stack

Node.js
Express.js
MySQL (with raw SQL queries)
JWT (JSON Web Token)
bcrypt.js

📂 Project Structure
├── config/          # Database configuration
├── controllers/     # Route controllers (task, auth logic)
├── database/        # MySQL database dump
├── middleware/      # Auth & role-based middlewares
├── routes/          # API routes
├── node_modules/    # Dependencies
├── .env             # Environment variables (DB, JWT_SECRET)
├── index.js         # Main entry point
├── package.json     # Project metadata & dependencies
├── package-lock.json
└── README.md        # Documentation

🔑 API Endpoints

Authentication
POST /auth/register → Register a new user
POST /auth/login → Login and receive a JWT

Task Management
POST /tasks → Create a new task (authenticated)
GET /tasks → Get all tasks (admin) / user’s tasks (user)
GET /tasks/:id → Get a specific task
PUT /tasks/:id → Update a task (owner only)
DELETE /tasks/:id → Delete a task (owner only)


📌 Additional Improvements
Password reset with email verification.

📌 Future Improvements
Admin dashboard for managing users.
Frontend integration with React/Vue.
Advanced task filters (date, priority).
