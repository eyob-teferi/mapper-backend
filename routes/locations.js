const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Location = require('../models/Location');
const mongoose = require('mongoose');

// Hardcode demo user ID (replace with the actual _id from your database)
const DEMO_USER_ID = '67e7f928c0f3fc3652acb936'; // Replace with your demo user's _id

// Add a new location to an order
router.post('/:orderId', async (req, res) => {
    const { address, description, lat, lng } = req.body;
    try {
        const order = await Order.findById(req.params.orderId).populate('locations');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Check for duplicate address (case-insensitive)
        const existingLocation = order.locations.find(loc => 
            loc.address.toLowerCase() === address.toLowerCase()
        );
        if (existingLocation) {
            return res.status(400).json({ message: 'This address has already been added to the project' });
        }

        const newLocation = new Location({
            address,
            description,
            lat,
            lng,
            order: req.params.orderId
        });
        const location = await newLocation.save();

        order.locations.push(location._id);
        await order.save();

        const updatedOrder = await Order.findById(req.params.orderId).populate('locations');
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a location
router.delete('/:orderId/:locationId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const location = await Location.findById(req.params.locationId);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        await location.deleteOne();
        order.locations = order.locations.filter(loc => loc.toString() !== req.params.locationId);
        await order.save();

        const updatedOrder = await Order.findById(req.params.orderId).populate('locations');
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reorder locations
router.put('/:orderId/reorder', async (req, res) => {
    const { locations } = req.body;
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        for (const locId of locations) {
            if (!mongoose.Types.ObjectId.isValid(locId)) {
                return res.status(400).json({ message: 'Invalid location ID' });
            }
        }

        order.locations = locations;
        await order.save();

        const updatedOrder = await Order.findById(req.params.orderId).populate('locations');
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;