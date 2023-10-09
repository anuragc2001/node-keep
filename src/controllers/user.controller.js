const {User} = require('../models/user.model')


const getAllUser = async (req, res) => {

    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
}

const getUser = async (req, res) => {
    const user = req.user
    const publicUser = await user.getPublicObject()
    res.send(publicUser)
}

const registerUser = async (req, res) => {
    
    
    try {
        const user = await User.findOne({userEmail: req.body.userEmail})
        if(user) return res.status(400).send('User already registed!')
    
        const newUser = new User(req.body)
        await newUser.save()

        const token = await newUser.generateAuthToken()
        res.status(201).send({msg: 'User successfully registered!', token})

    } catch (error) {
        res.status(400).send(error)
    }
}

const updateUser =  async (req, res) => {

    const updates = Object.keys(req.body)
    const allowed = ['userName', 'userAge', 'userPassword', 'userEmail']
    const isValid = updates.every((update) => { return allowed.includes(update)})

    if(!isValid) return res.status(400).send('Invalid Update')

    try {
        const user = await User.findById(req.user._id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        res.status(200).send(user)
        
    } catch (e) {
        res.status(400).send(e)
    }
}

const deleteUser = async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.user._id)
        res.status(200).send(user)

    } catch (error) {
        res.status(500).send(error)
    }
}

const userLogin = async (req, res) => {
    const email = req.body.userEmail
    const password = req.body.userPassword

    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        const publicUser = await user.getPublicObject()
        res.status(200).send({publicUser, token})
    } catch (error) {
        res.status(404).send(error)
    }

}

const userLogout = async (req, res) => {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    try{
        await req.user.save()
        res.status(200).send(req.user)

    }catch(e){
        res.status(500).send(e)
    }
}

const logoutAll = async (req, res) => {
    req.user.tokens = []
    try {
        await req.user.save()
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = {
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    registerUser,
    userLogin,
    userLogout,
    logoutAll
}