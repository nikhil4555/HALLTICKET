// models/CenterCapacity.js
const mongoose = require('mongoose');

const centerCapacitySchema = new mongoose.Schema({
    center: {
       type: String,
       required: true 
    },
    capacity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('CenterCapacity', centerCapacitySchema);
