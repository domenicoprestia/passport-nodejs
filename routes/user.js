const express = require('express')
const {getLogin, getRegister, postRegister, postLogin, getLogout} = require('../controllers/user')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

router.get('/login', getLogin)

router.get('/register',  getRegister)

router.post('/register', postRegister)

router.post('/login', postLogin)

router.get('/logout', ensureAuthenticated, getLogout)

module.exports = router