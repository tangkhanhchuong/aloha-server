const postService = require('./post.service');

const postController = {
  create: async (req, res, next) => {
    try {
      const { content, images } = req.body;

      const { newPost } = await postService.create({
        content,
        images,
        user: req.user,
      });

      return res.json({
        msg: 'Created Post!',
        newPost,
      });
    } catch (err) {
      return next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const { posts } = await postService.list({
        user: req.user,
        query: req.query,
      });

      return res.json({
        msg: 'Success!',
        posts,
        count: posts.length,
      });
    } catch (err) {
      return next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { content, images } = req.body;

      const { post } = await postService.update({
        content,
        images,
        postId: req.params.id,
      });

      return res.json({
        msg: 'Updated Post!',
        post,
      });
    } catch (err) {
      return next(err);
    }
  },

  like: async (req, res, next) => {
    try {
      await postService.like({
        postId: req.params.id,
        user: req.user,
      });
      return res.json({ msg: 'Liked Post!' });
    } catch (err) {
      return next(err);
    }
  },

  unlike: async (req, res, next) => {
    try {
      await postService.unlike({
        postId: req.params.id,
        user: req.user._id,
      });
      return res.json({ msg: 'UnLiked Post!' });
    } catch (err) {
      return next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      const { post } = await postService.get({
        id: req.params.id,
      });
      return res.json({
        post,
      });
    } catch (err) {
      return next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { post } = await postService.delete({
        id: req.params.id,
        user: req.user,
      });

      return res.json({
        msg: 'Deleted Post!',
        post,
      });
    } catch (err) {
      return next(err);
    }
  },

  save: async (req, res, next) => {
    try {
      await postService.save({
        id: req.params.id,
        userId: req.user._id,
      });
      res.json({ msg: 'Saved Post!' });
    } catch (err) {
      return next(err);
    }
  },

  unsave: async (req, res, next) => {
    try {
      await postService.unsave({
        id: req.params.id,
        userId: req.user._id,
      });
      res.json({ msg: 'Unsaved Post!' });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = postController;
