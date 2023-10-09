const mongoose = require('mongoose')
const express = require('express')

require('dotenv').config()
require('./src/db/mongoose.db')

PORT = process.env.PORT || 3000

const db = mongoose.connection
const app = express()

const userRoute = require('./src/routes/user.routes')
const taskRoute = require('./src/routes/task.routes')


// app.use((req, res) => res.send('Site under construction'))

app.use(express.json())
app.use('/user', userRoute)
app.use('/task', taskRoute)


app.get('/', (req, res) => {
    res.send('Server up and running :)')
})



app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT} 😊`)
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected to MongoDB Atlas! 😊");
    });
})