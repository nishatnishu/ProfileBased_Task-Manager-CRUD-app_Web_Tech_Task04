const db = require('../config/db');

// ✅ Create a Task (belongs to logged-in user)
exports.createTask = (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
    }

    const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, status || 'Pending', userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task created successfully", taskId: result.insertId });
    });
};

// ✅ Get Tasks (filtering + search)
exports.getTasks = (req, res) => {
    const userId = req.user.id;
    const { status, search } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    let params = [userId];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// ✅ Update a Task (only owner can update)
exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    const query = 'UPDATE tasks SET title=?, description=?, status=? WHERE id=? AND user_id=?';
    db.query(query, [title, description, status, id, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found or not authorized" });
        }
        res.json({ message: "Task updated successfully" });
    });
};

// ✅ Delete a Task (only owner can delete)
exports.deleteTask = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const query = 'DELETE FROM tasks WHERE id=? AND user_id=?';
    db.query(query, [id, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found or not authorized" });
        }
        res.json({ message: "Task deleted successfully" });
    });
};

// ✅ Admin: View All Tasks (RBAC applied in routes)
exports.getAllTasksAdmin = (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
