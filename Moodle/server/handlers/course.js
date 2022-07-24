const db = require('../models')

// Get all courses in db
exports.allCourses = async (req,res,next) => {
    try{
        const courses = await db.Course.find()
        res.status(200).json(courses)
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Get user courses
exports.userCourses = async (req, res, next) => {
    try{
        const {id} = req.decoded
        const user = await db.User.findById(id).populate('courses') // populate turns object_id into course objects
        const courses = user.courses
        res.status(201).json(courses)
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Create new course
exports.createCourse = async (req, res, next) => {
    try{
        const {id} = req.decoded
        var user = await db.User.findById(id)
        const {number, name} = req.body
        const course = await db.Course.create({
            number,
            name,
            user,
        }) //throws of exists
        user.courses.push(course._id)
        await user.save()
        res.status(201).json({...course._doc, user: user._id})
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Sign student to course
exports.sign = async (req, res, next) => {
    try{
        const {id} = req.decoded
        const user = await db.User.findById(id)
        const {_id} = req.body
        const course = await db.Course.findById(_id)
        if(!course){
            const err = new Error('Course not found')
            throw(err)
        }
        for(let i=0; i< user.courses.length; i++){
            if(user.courses[i].valueOf() === course._id.valueOf()){
                const err = new Error('Already signed to course')
                throw(err)
            }
        }
        user.courses.push(course._id)
        course.students.push(user._id)
        await user.save()
        await course.save()
        res.status(201).json({...course._doc, user: user._id})
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Get course classrooms
exports.courseRooms = async (req, res, next) => {
    try{
        const {_id} = req.body
        console.log(_id)
        const course = await db.Course.findById(_id).populate("classrooms")
        console.log(course)
        res.status(201).json(course.classrooms)
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Create new classroom for course
exports.createRoom = async (req, res, next) => {
    try{
        const {id} = req.decoded
        const user = await db.User.findById(id)
        const {question, options} = req.body
        const poll = await db.Poll.create({
            user,
            question,
            options: options.map(option => ({
                option, votes: 0
            }))
        })
        user.polls.push(poll._id)
        await user.save()
        res.status(201).json({...poll._doc, user: user._id})
    }catch(err){
        err.status = 400
        next(err)
    }
}