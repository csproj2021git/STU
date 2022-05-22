const mongoose = require('mongoose')

const optionScehma = new mongoose.Schema({
    option: String,
    votes:{
        type: Number,
        default: 0
    }
})

//Exported - poll schema
const pollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    question: String,
    options: [optionScehma],
    voted: [{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
        }]
})

module.exports = mongoose.model('Poll',pollSchema)