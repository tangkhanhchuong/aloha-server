const conversationService = require('./conversation.service');

const conversationController = {
  list: async (req, res, next) => {
    try {
      const { conversations } = await conversationService.list({
        userId: req.user._id,
        query: req.query,
      });

      return res.json({
        conversations,
        count: conversations.length,
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await conversationService.delete({
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ msg: 'Delete Success!' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = conversationController;
