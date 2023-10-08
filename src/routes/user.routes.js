const express = require('express')
const router = express.Router()
const {User} = require('../models/user.model')

router.get('/all', async (req, res) => {

    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/id/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user =  await User.findById(_id)
        if(!user) return res.status(404).send('User not found')
        res.status(200).send(user)

    } catch (error){
        res.status(400).send(error);
    }

})

router.post('/register', async (req, res) => {

    const newUser = new User(req.body)

    try {
        await newUser.save()
        res.status(201).send('User successfully registered!')

    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/id/:id', async (req, res) => {
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowed = ['userName', 'userAge', 'userPassword', 'userEmail']
    const isValid = updates.every((update) => { return allowed.includes(update)})

    if(!isValid) return res.status(400).send('Invalid Update')

    try {
        const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        res.status(200).send(user)
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/id/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findByIdAndDelete(_id)
        if(!user) return res.status(404).send('User not found')
        res.status(200).send(user)

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router