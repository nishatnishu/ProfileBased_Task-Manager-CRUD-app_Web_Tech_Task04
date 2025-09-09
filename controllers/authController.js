const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ✅ Register User (with unique username/email check & single admin/co-admin restriction)
exports.register = (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if username/email already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkQuery, [email, username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }

        // Admin/co-admin logic
        if (role === 'admin' || role === 'co-admin') {
            const roleCheckQuery = 'SELECT COUNT(*) as total FROM users WHERE role = ?';
            db.query(roleCheckQuery, [role], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                if (result[0].total > 0) {
                    return res.status(403).json({ error: `${role.replace('-', ' ')} already exists` });
                }

                // Insert admin/co-admin
                const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
                db.query(query, [username, email, hashedPassword, role], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.json({ message: `${role.replace('-', ' ')} registered successfully` });
                });
            });
        } else {
            // Insert regular user
            const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(query, [username, email, hashedPassword, role || 'user'], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "User registered successfully", userId: result.insertId });
            });
        }
    });
};

// ✅ Login User
exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: "Invalid email or password" });

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: "Invalid email or password" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    });
};

// ✅ Request Password Reset
exports.requestPasswordReset = (req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    const query = 'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?';
    db.query(query, [token, expires, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Email not found' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Use this token to reset your password: ${token}`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ message: 'Password reset email sent' });
        });
    });
};

// ✅ Reset Password
exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    const query = 'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()';
    db.query(query, [token], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const updateQuery = 'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?';
        db.query(updateQuery, [hashedPassword, results[0].id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Password has been reset successfully' });
        });
    });
};
