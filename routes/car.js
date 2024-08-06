const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

// Add new car (Admin)
router.post('/car/create', authenticateAdmin, (req, res) => {
    const { category, model, number_plate, current_city, rent_per_hr } = req.body;
    const rent_history = JSON.stringify([]);

    const query = `INSERT INTO cars (category, model, number_plate, current_city, rent_per_hr, rent_history) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [category, model, number_plate, current_city, rent_per_hr, rent_history], function(err) {
        if (err) {
            return res.status(400).json({ status: 'Failed to add car', status_code: 400 });
        }
        res.json({ message: 'Car added successfully', car_id: this.lastID, status_code: 200 });
    });
});

// Get available rides
router.get('/car/get-rides', (req, res) => {
    const { origin, destination, category, required_hours } = req.query;

    const query = `SELECT * FROM cars WHERE category = ? AND current_city = ?`;
    db.all(query, [category, origin], (err, cars) => {
        if (err) {
            return res.status(400).json({ status: 'Error fetching rides', status_code: 400 });
        }

        const availableCars = cars.map(car => {
            const total_payable_amt = car.rent_per_hr * required_hours;
            return {
                ...car,
                rent_history: JSON.parse(car.rent_history),
                total_payable_amt
            };
        });

        res.json(availableCars);
    });
});

// Rent a car
router.post('/car/rent', authenticateToken, (req, res) => {
    const { car_id, origin, destination, hours_requirement } = req.body;
    const user_id = req.user.id;

    const query = `SELECT * FROM cars WHERE id = ? AND current_city = ?`;
    db.get(query, [car_id, origin], (err, car) => {
        if (err || !car) {
            return res.status(400).json({ status: 'No car is available at the moment', status_code: 400 });
        }

        const total_payable_amt = car.rent_per_hr * hours_requirement;

        const insertQuery = `INSERT INTO reservations (user_id, car_id, origin, destination, hours_requirement, total_payable_amt) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(insertQuery, [user_id, car_id, origin, destination, hours_requirement, total_payable_amt], function(err) {
            if (err) {
                return res.status(400).json({ status: 'Failed to rent car', status_code: 400 });
            }

            const updatedRentHistory = JSON.parse(car.rent_history);
            updatedRentHistory.push({ origin, destination, amount: total_payable_amt });

            const updateQuery = `UPDATE cars SET current_city = ?, rent_history = ? WHERE id = ?`;
            db.run(updateQuery, [destination, JSON.stringify(updatedRentHistory), car_id], function(err) {
                if (err) {
                    return res.status(400).json({ status: 'Failed to update car details', status_code: 400 });
                }

                res.json({ status: 'Car rented successfully', status_code: 200, rent_id: this.lastID, total_payable_amt });
            });
        });
    });
});

// Ride completion (Admin)
router.post('/car/update-rent-history', authenticateAdmin, (req, res) => {
    const { car_id, ride_details } = req.body;

    const query = `SELECT * FROM cars WHERE id = ?`;
    db.get(query, [car_id], (err, car) => {
        if (err || !car) {
            return res.status(400).json({ status: 'Car not found', status_code: 400 });
        }

        const updatedRentHistory = JSON.parse(car.rent_history);
        updatedRentHistory.push(ride_details);

        const updateQuery = `UPDATE cars SET rent_history = ? WHERE id = ?`;
        db.run(updateQuery, [JSON.stringify(updatedRentHistory), car_id], function(err) {
            if (err) {
                return res.status(400).json({ status: 'Failed to update car rent history', status_code: 400 });
            }

            res.json({ status: 'Car\'s rent history updated successfully', status_code: 200 });
        });
    });
});

module.exports = router;
