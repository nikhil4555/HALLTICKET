const mongoose = require('mongoose');
const { emit } = require("nodemon");
const bcrypt = require('bcryptjs');

const userschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    issuedDate:{
        type: Date,
        default: Date.now
    }
})
userschema.pre('save',async function(next ){
    
    if(this.isModified('password')){//if changed the password then it wil modified and can change it 
    this.password = await bcrypt.hash(this.password,10); //here we are taking the password from the user i.e. app.js to here and using bcrypt to hash it
    // this.confirmpassword = undefined;
    next();
    }
})
const User = new mongoose.model('User',userschema);
module.exports = User;
