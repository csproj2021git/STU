const router = require('express').Router()
const handle = require('../handlers')

//localhost:PORT/api/auth/register
router.route('/register')
.post(handle.register)

//localhost:PORT/api/auth/login
router.route('/login')
.post(handle.login)

module.exports = router