const jwt = require('jsonwebtoken')
const {User} = require('../models/user.model')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        
        const data = jwt.verify(token, "secretkey")
        const user = await User.findOne({_id: data.userID, "tokens.token": token})
        
        if(!user) throw new Error()

        req.user = user
        req.token = token

        next()
    }catch (e) {
        res.status(400).send({error: "User not authenticated"})
    }
}

module.exports = auth