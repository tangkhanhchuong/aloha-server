const router = require('express').Router()

const commentController = require('../controllers/comment.controller')
const auth = require('../middleware/auth')

router.post('/', auth, commentController.create)
router.patch('/:id', auth, commentController.update)
router.patch('/:id/like', auth, commentController.like)
router.patch('/:id/unlike', auth, commentController.unlike)
router.delete('/:id', auth, commentController.delete)

module.exports = router