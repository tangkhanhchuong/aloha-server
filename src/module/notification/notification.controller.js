const notificationService = require("./notification.service");

const notificationController = {
  create: async (req, res, next) => {
    try {
      const { id, recipients, url, text, content } = req.body;
      const { notification } = await notificationService.create({
        id,
        recipients,
        url,
        text,
        content,
        user: req.user,
      });
      return res.json({ notification });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const { notification } = await notificationService.remove({
        id: req.params.id,
        url: req.query.url,
      });

      return res.json({ notification });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const { notifications } = await notificationService.list({
        userId: req.user._id,
      });
      return res.json({ notifications });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const { notification } = await notificationService.markAsRead({
        id: req.params.id,
      });

      return res.json({ notification });
    } catch (err) {
      next(err);
    }
  },

  deleteAll: async (req, res, next) => {
    try {
      const { notifications } = await notificationService.deleteAll({
        userId: req.user._id,
      });
      return res.json({ notifications });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = notificationController;
