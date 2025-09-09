Profile-Based Task Manager CRUD App – Web Tech Task 04

📌 Description

This project is an enhanced Task Manager Application built with Node.js, Express.js, and MySQL.
It introduces profile-based access control with authentication and authorization, ensuring that users can manage only their own tasks.

The app supports full CRUD operations, user registration/login, role-based access (Admin & User), and password reset with email verification.

Developed as part of Web Tech – Task 04.

🚀 Features

User Authentication (JWT-based)

Secure registration and login.

Passwords hashed with bcrypt.

Authorization

Role-based access control (admin & user).

Users can only access their own tasks.

MySQL Integration

Persistent storage with raw SQL queries (no ORM).

Users ↔ Tasks (one-to-many relationship).

Task Management

Create, Read, Update, Delete tasks.

Filter tasks by status.

Each task linked to its owner.

Password Reset with Email Verification 

Users can request password reset via email.

Token-based secure reset flow.

Middleware

Authentication middleware for JWT verification.

Authorization middleware for role-based route protection.

Environment Config

.env file for DB credentials, JWT secret, and mail service credentials.

🛠️ Tech Stack

Node.js

Express.js

MySQL

JWT (JSON Web Token)

bcrypt.js

Nodemailer (for email verification)

📂 Project Structure
├── config/          # Database & mail configuration
├── controllers/     # Route controllers (auth, task, reset logic)
├── database/        # MySQL database dump
├── middleware/      # Authentication & authorization middlewares
├── routes/          # API route definitions
├── node_modules/    # Dependencies
├── .env             # Environment variables
├── index.js         # App entry point
├── package.json     # Dependencies & scripts
└── README.md        # Documentation

🔑 API Endpoints

Authentication


POST /auth/register → Register new user

POST /auth/login → Login & receive JWT

POST /auth/request-reset → Request password reset (sends email)

POST /auth/reset-password/:token → Reset password using token

Task Management


POST /tasks → Create new task (authenticated)

GET /tasks → Get user’s tasks (user) / all tasks (admin)

GET /tasks/:id → Get a specific task

PUT /tasks/:id → Update a task (owner only)

DELETE /tasks/:id → Delete a task (owner only)

📌 Additional Improvements

Password reset with email verification.


📌 Future Improvements

Admin dashboard for managing users & tasks.

Frontend with React/Vue for UI.

Advanced task filters (priority, due dates).
