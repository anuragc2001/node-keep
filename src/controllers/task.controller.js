const {Task} = require('../models/task.model')

const addTask = async (req, res) => {
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await newTask.save()
        res.status(201).send('Task added successfully...')

    }catch(e) {
        res.status(400).send(e)
    }
}

const getAllTask = async (req, res) => {
    const _id = String(req.user._id)
    try {
        const tasks = await Task.find({"owner": _id})
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }

}

const getTask = async (req, res) => {
    const _id = String(req.user._id)

    try{
        const task = await Task.findOne({"owner": _id})
    
        if(!task) return res.status(404).send('Task not found')
        await task.populate(['owner'])
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }
}

const updateTask = async (req, res) => {
    const _id = String(req.user._id)

    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isValid = updates.every((update) => { return allowed.includes(update)})

    if(!isValid) return res.status(400).send('Invalid Update')

    try {
        const task = await Task.findOneAndUpdate({"owner": _id})
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        res.status(200).send(task)
        
    } catch (e) {
        res.status(400).send(e)
    }
}

const deleteTask = async (req, res) => {
    const _id = String(req.user._id)

    try {
        const task = await Task.findOneAndDelete({"owner": _id});
        if(!task) return res.status(404).send('Task not found')
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = {
    deleteTask,
    addTask,
    getAllTask,
    getTask,
    updateTask
}