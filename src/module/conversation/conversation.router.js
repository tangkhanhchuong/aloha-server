const router = require('express').Router();

const conversationController = require('./conversation.controller');
const auth = require('../../middleware/auth');

router.get('/', auth, conversationController.list);
router.delete('/:id', auth, conversationController.delete);

module.exports = router;
