const mongoose = require('mongoose')

//Exported - poll schema
const envSchema = new mongoose.Schema({
    secret: String,
})

module.exports = mongoose.model('Env',envSchema)