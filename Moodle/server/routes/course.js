const router = require('express').Router()
const handle = require('../handlers')
const middlewares = require('../middlewares')

//domain/course/
router.route('/')
.get(middlewares.authorize, handle.allCourses) 
.post(middlewares.authorize, handle.createCourse) 

//domain/course/user
router.route('/user')
.get(middlewares.authorize, handle.userCourses)
.post(middlewares.authorize, handle.sign) 

//domain/course/room
router.route('/room')
.get(middlewares.authorize, handle.courseRooms)
.post(middlewares.authorize, handle.createRoom)

module.exports = router