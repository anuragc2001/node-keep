const express = require('express')
const router = express.Router()
const {User} = require('../models/user.model')
const auth = require('../middlewares/auth.middleware')

const {
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    registerUser,
    userLogin,
    userLogout,
    logoutAll} = require('../controllers/user.controller')

router.get('/all', getAllUser)

router.get('/me', auth, getUser)

router.post('/register', registerUser)

router.patch('/update', auth, updateUser)

router.delete('/delete', auth, deleteUser)

router.post('/login', userLogin)

router.post('/logout', auth, userLogout)

router.post('/all/logout', auth, logoutAll)

router.delete('/delall', async (req, res) => {
    await User.deleteMany({})
    res.status(200).send('deleted')
})

module.exports = router