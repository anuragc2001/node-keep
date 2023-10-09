const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },

    userEmail: {
        type: String,
        unique: true,
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

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userModel.methods.generateAuthToken = async function (){
    const user = this
    const userID = String(user._id)
    const token = jwt.sign({userID}, "secretkey", {expiresIn: '1d'})
    user.tokens = user.tokens.concat({token})

    await user.save()

    return token;

}

userModel.methods.getPublicObject = async function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.userPassword
    delete userObject.tokens

    return userObject
}

userModel.pre('save', async function (next) {
    
    const user = this
    
    if(user.isModified('userPassword')){
        user.userPassword = await bcrypt.hash(user.userPassword, 8)
    }
    
    next()
})

userModel.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({userEmail: email})

    if(!user) throw new Error('User not found')

    const isMatched = await bcrypt.compare(password, user.userPassword)

    if(!isMatched) throw new Error('Incorrect Password')

    return user

}

const User = mongoose.model('User', userModel)

module.exports = {
    User,
}