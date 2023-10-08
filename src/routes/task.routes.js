const express = require('express')
const router = express.Router()
const {Task} = require('../models/task.model')

router.get('/all', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/id/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task) return res.status(404).send('Task not found')
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/id/:id', async (req, res) => {
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isValid = updates.every((update) => { return allowed.includes(update)})

    if(!isValid) return res.status(400).send('Invalid Update')

    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        res.status(200).send(task)
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/newtask', async (req, res) => {
    const newTask = new Task(req.body)

    try{
        await newTask.save()
        res.status(201).send('Task added successfully...')

    }catch(e) {
        res.status(400).send(e)
    }
})


module.exports = router