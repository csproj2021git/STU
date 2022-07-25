const router = require('express').Router()
const handle = require('../handlers')
const middlewares = require('../middlewares')

//domain/api/course/
router.route('/')
.get(handle.allCourses)
.post(middlewares.authorize, handle.createCourse)

//domain/api/course/user
router.route('/user')
.get(middlewares.authorize, handle.userCourses) 
.post(middlewares.authorize, handle.sign) 

//domain/api/course/room
router.route('/room')
.put(middlewares.authorize, handle.courseRooms)
.post(middlewares.authorize, handle.createRoom)

module.exports = router