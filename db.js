const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        role TEXT
    )`);

    // Cars table
    db.run(`CREATE TABLE cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        model TEXT,
        number_plate TEXT UNIQUE,
        current_city TEXT,
        rent_per_hr INTEGER,
        rent_history TEXT
    )`);

    // Reservations table
    db.run(`CREATE TABLE reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        car_id INTEGER,
        origin TEXT,
        destination TEXT,
        hours_requirement INTEGER,
        total_payable_amt INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(car_id) REFERENCES cars(id)
    )`);
});

module.exports = db;
