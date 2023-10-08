const mongoose = require('mongoose')

const taskModel = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },

    completed: {
        type: Boolean,
        required: false,
        default: false,
    }
})

const Task = mongoose.model('Task', taskModel)

module.exports = {
    Task,
}