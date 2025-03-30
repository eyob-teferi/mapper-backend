const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    address: { type: String, required: true },
    description: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
});

module.exports = mongoose.model('Location', locationSchema); 