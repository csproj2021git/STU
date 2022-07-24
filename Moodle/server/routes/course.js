const router = require('express').Router()
const handle = require('../handlers')
const middlewares = require('../middlewares')

//domain/course/
router.route('/')
.get(middlewares.authorize, handle.allCourses) //V
.post(middlewares.authorize, handle.createCourse) //V

//domain/course/user
router.route('/user')
.get(middlewares.authorize, handle.userCourses) //V
.post(middlewares.authorize, handle.sign) //V

//domain/course/room
router.route('/room')
.get(middlewares.authorize, handle.courseRooms)
.post(middlewares.authorize, handle.createRoom)

module.exports = router