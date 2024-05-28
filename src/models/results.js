//results
const mongoose = require('mongoose');

const results = new mongoose.Schema({
    hallticket: {
       type: String,
    },
    email: {
        type: String,
        
    },
    score:{
        type: Number,
    }
});

module.exports = mongoose.model('examresults', results);
