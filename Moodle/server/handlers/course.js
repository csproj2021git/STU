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
        const user = await db.User.findById(id).populate('courses')
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
        const user = await db.User.findById(id)
        const {number, name} = req.body
        const course = await db.Course.create({
            number,
            name,
            user,
        })
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

// Get course classrooms
exports.courseRooms = async (req, res, next) => {
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