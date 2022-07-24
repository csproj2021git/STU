const mongoose = require('mongoose')

//Exported - classroom schema
const classroomScema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Course',
    },
    name:{
        type: String, 
    },
})


//Exported - course schema
const courseSchema = new mongoose.Schema({
    number:{ //course number
        type: String,
        required: true,
        unique: true,
    },
    name:{ //course name
        type: String,
    },
    username:{ //owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    students:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',}
],
    classroom:[classroomScema],
})

module.exports = mongoose.model('Course', courseSchema)
module.exports = mongoose.model('Course', courseSchema)