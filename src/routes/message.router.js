const router = require('express').Router()

const messageController = require('../controllers/message.controller')
const auth = require('../middleware/auth')

router.post('/', auth, messageController.create)
router.get('/:id', auth, messageController.list)
router.delete('/:id', auth, messageController.delete)

module.exports = router