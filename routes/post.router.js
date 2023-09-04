const router = require('express').Router()

const postController = require('../controllers/post.controller')
const auth = require('../middleware/auth')

router.route('/')
    .post(auth, postController.create)
    .get(auth, postController.list)
router.route('/:id')
    .patch(auth, postController.update)
    .get(auth, postController.get)
    .delete(auth, postController.delete)
router.patch('/:id/like', auth, postController.like)
router.patch('/:id/unlike', auth, postController.unlike)
router.patch('/:id/save', auth, postController.save)
router.patch('/:id/unsave', auth, postController.unsave)

module.exports = router