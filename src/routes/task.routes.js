const express = require('express')
const router = express.Router()
const {Task} = require('../models/task.model')

const {
    deleteTask,
    addTask,
    getAllTask,
    getTask,
    updateTask} = require('../controllers/task.controller')

router.get('/all', getAllTask)

router.get('/id/:id', getTask)

router.patch('/id/:id', updateTask)

router.post('/new', addTask)

router.delete('/id/:id', deleteTask)

router.delete('/delall', async (req, res) => {
    await Task.deleteMany({})
    res.status(200).send('deleted')
})

module.exports = router