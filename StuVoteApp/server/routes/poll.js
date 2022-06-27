const router = require('express').Router()
const handle = require('../handlers')
const middlewares = require('../middlewares')

//localhost:PORT/api/poll/
router.route('/')
.get(middlewares.authorize, handle.showPolls)
.post(middlewares.authorize, handle.createPoll)

//localhost:PORT/api/poll/user
router.route('/user')
.get(middlewares.authorize, handle.usersPolls)

//localhost:PORT/api/poll/:id
router.route('/:id')
.get(handle.getPoll)
.post(middlewares.authorize, handle.vote)
.delete(middlewares.authorize, handle.deletePoll)

module.exports = router

