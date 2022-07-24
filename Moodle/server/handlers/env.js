const db = require('../models')

exports.getSecret = async () =>{
    try{
        const {secret} = await db.Env.findOne()
        console.log(`Secret is: ${secret}`)
        process.env.SECRET = secret
    }catch(err){
    }
}