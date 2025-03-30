const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', require('./routes/auth')); // Comment out auth route
app.use('/api/orders', require('./routes/orders'));
app.use('/api/locations', require('./routes/locations'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));