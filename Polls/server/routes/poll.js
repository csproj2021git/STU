const router = require('express').Router()
const handle = require('../handlers')
const middlewares = require('../middlewares')

//localhost:PORT/api/polls/
router.route('/')
.get(middlewares.authorize, handle.showPolls)
.post(middlewares.authorize, handle.createPoll)

//localhost:PORT/api/polls/user
router.route('/user')
.get(middlewares.authorize, handle.usersPolls)

//localhost:PORT/api/polls/:id
router.route('/:id')
.get(middlewares.authorize, handle.getPoll)
.post(middlewares.authorize, handle.vote)
.delete(middlewares.authorize, handle.deletePoll)

module.exports = router

