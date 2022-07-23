const db = require('../models')
const jwt = require('jsonwebtoken')

// Register user
exports.register = async (req, res, next) =>{
    console.log("Im here!")
    try{
        const user = await db.User.create(req.body)
        const { id, username } = user
        const token = jwt.sign({id,username},process.env.SECRET)
        res.status(201).json({ id, username, token })
    }catch(err){
        if(err.code === 11000){
            err.message = 'Username already taken'
        }
        next(err)
    }
}

// Login user
exports.login = async (req, res, next) =>{
    try{
        const user = await db.User.findOne({username: req.body.username})
        const {id, username} = user
        const valid = await user.comparePassword(req.body.password)
        if(valid){
            const token = jwt.sign({id,username},process.env.SECRET)
            res.json({id, username, token})
        } else{
            throw new Error()
        }
    }catch(err){
        err.message = 'Invalid username/password'
        next(err)
    }
}