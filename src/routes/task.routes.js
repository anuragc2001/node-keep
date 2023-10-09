const express = require('express')
const router = express.Router()
const {Task} = require('../models/task.model')
const auth = require('../middlewares/auth.middleware')

const {
    deleteTask,
    addTask,
    getAllTask,
    getTask,
    updateTask} = require('../controllers/task.controller')

router.get('/', auth, getAllTask)

router.get('/task', auth, getTask)

router.patch('/update', auth, updateTask)

router.post('/new', auth, addTask)

router.delete('/delete', auth, deleteTask)

router.delete('/delall', async (req, res) => {
    await Task.deleteMany({})
    res.status(200).send('deleted')
})

module.exports = router