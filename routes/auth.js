const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const SECRET_KEY = 'WORKINDIA_TEST';

// Register
router.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'admin')`;
    db.run(query, [username, hashedPassword, email], function(err) {
        if (err) {
            return res.status(400).json({ status: 'Username already exists', status_code: 400 });
        }
        res.json({ status: 'Account successfully created', status_code: 200, user_id: this.lastID });
    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ status: 'Incorrect username/password provided. Please retry', status_code: 401 });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ status: 'Login successful', status_code: 200, user_id: user.id, access_token: token });
    });
});

module.exports = router;
