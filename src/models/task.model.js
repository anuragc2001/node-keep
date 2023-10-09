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
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

taskModel.pre('save', async function () {
    console.log('task saved!!!');
})

const Task = mongoose.model('Task', taskModel)

module.exports = {
    Task,
}