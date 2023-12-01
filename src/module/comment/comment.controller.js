const commentService = require("./comment.service");

const commentController = {
  create: async (req, res, next) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;

      const { newComment } = await commentService.create({
        postId,
        content,
        tag,
        reply,
        postUserId,
        userId: req.user._id,
      });
      return res.json({ newComment });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { content } = req.body;
      await commentService.update({
        content,
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ msg: "Update Success!" });
    } catch (err) {
      next(err);
    }
  },

  like: async (req, res, next) => {
    try {
      await commentService.like({
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ msg: "Liked Comment!" });
    } catch (err) {
      next(err);
    }
  },

  unlike: async (req, res, next) => {
    try {
      await commentService.unlike({
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ msg: "UnLiked Comment!" });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await commentService.delete({
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ msg: "Deleted Comment!" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = commentController;
