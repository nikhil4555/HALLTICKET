// models/HallTicket.js
const mongoose = require('mongoose');
const { type } = require('requests');

const hallTicketSchema = new mongoose.Schema({
    name: {
       type:String,
       required:true 
    },
    fatherName:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    preferences: {
        type: [String],
        required: true
    }, 
    assignedCenter: { // New field for the assigned center
        type: String,
        required: false // This field is not required because a center might not be assigned if all preferences are full
    },
    issueDate: { 
        type: Date,
        default: Date.now 
    },
    hallTicketNumber: {
        type: String,
        required: true,
        unique: true // Ensure unique hall ticket numbers
      }
});

module.exports = mongoose.model('HallTicket', hallTicketSchema);
