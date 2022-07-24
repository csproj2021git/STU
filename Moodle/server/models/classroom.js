const mongoose = require('mongoose')

//Exported - classroom schema
const classroomSchema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Course',
    },
    name:{
        type: String, 
    },
})

module.exports = mongoose.model('Classroom', classroomSchema)