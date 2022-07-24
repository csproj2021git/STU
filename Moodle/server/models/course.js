const mongoose = require('mongoose')

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
    user:{ //owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    students:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    classrooms:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
    }],
})

module.exports = mongoose.model('Course', courseSchema)