const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // Comment out auth middleware
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Hardcode demo user ID (replace with the actual _id from your database)
const DEMO_USER_ID = '67e7f928c0f3fc3652acb936'; // Replace with your demo user's _id

// Get all orders for the demo user
router.get('/', /*auth,*/ async (req, res) => { // Remove auth middleware
    try {
        const orders = await Order.find({ user: DEMO_USER_ID }).populate('locations');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new order
router.post('/', /*auth,*/ async (req, res) => { // Remove auth middleware
    const { name } = req.body;
    try {
        const newOrder = new Order({
            name,
            user: DEMO_USER_ID, // Use demo user ID
            locations: []
        });
        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an order
router.delete('/:id', /*auth,*/ async (req, res) => { // Remove auth middleware
    try {
        // Validate the order ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Skip user authentication check for demo
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({ message: 'User not authenticated' });
        // }
        // if (!order.user) {
        //     return res.status(500).json({ message: 'Order has no associated user' });
        // }
        // if (order.user.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }

        // Delete the order (pre-delete hook will handle associated locations)
        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;