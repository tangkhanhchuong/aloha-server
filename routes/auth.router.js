const router = require('express').Router()

const authController = require('../controllers/auth.controller')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/refreshToken', authController.generateAccessToken)

module.exports = router