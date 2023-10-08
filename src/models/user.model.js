const mongoose = require('mongoose')
const validator = require('validator')

const userModel = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },

    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid Emaild')
        }
    },

    userAge: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0) throw new Error('Age must be positive integer')
        }
    },

    userPassword: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('Password cannot contain the word password')
        }
    },
})

const User = mongoose.model('User', userModel)

module.exports = {
    User,
}