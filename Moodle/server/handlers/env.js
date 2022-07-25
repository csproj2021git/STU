const db = require('../models')

exports.getSecret = async () =>{
    try{
        const {secret} = await db.Env.findOne()
        process.env.SECRET = secret
    }catch(err){
    }
}