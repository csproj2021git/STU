const db = require('../models')

exports.getSecret = async () =>{
    try{
        const {secret} = await db.Env.findOne()
        process.env.SECRET = secret
        console.log(`Secret is : ${process.env.SECRET}`)
    }catch(err){
        if(err.code === 11000){
            err.message = 'Username already taken'
        }
        next(err)
    }
}