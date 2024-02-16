const userService = require('./user.service');

const userController = {
  search: async (req, res, next) => {
    try {
      const { users } = await userService.search({
        username: req.query.username,
      });
      return res.json({
        users,
      });
    } catch (err) {
      next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      const { user } = await userService.get({
        id: req.params.id,
      });
      return res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } =
        req.body;

      await userService.update({
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
        userId: req.user._id,
      });
      return res.json({ msg: 'Update Success!' });
    } catch (err) {
      next(err);
    }
  },

  follow: async (req, res, next) => {
    try {
      const { user } = await userService.follow({
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  unfollow: async (req, res, next) => {
    try {
      const { user } = await userService.unfollow({
        id: req.params.id,
        userId: req.user._id,
      });
      return res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  suggest: async (req, res, next) => {
    try {
      const { users } = await userService.suggest({
        user: req.user,
        query: req.query,
      });
      return res.json({
        users,
        count: users.length,
      });
    } catch (err) {
      next(err);
    }
  },

  getUserPosts: async (req, res, next) => {
    try {
      const { posts, count } = await userService.getUserPosts({
        user: req.user,
        query: req.query,
      });
      return res.json({
        posts,
        count,
      });
    } catch (err) {
      next(err);
    }
  },

  getDiscoverPosts: async (req, res, next) => {
    try {
      const { posts } = await userService.getDiscoverPosts({
        user: req.user,
        query: req.query,
      });
      return res.json({
        msg: 'Success!',
        count: posts.length,
        posts,
      });
    } catch (err) {
      next(err);
    }
  },

  getSavedPosts: async (req, res, next) => {
    try {
      const { savedPosts, count } = await userService.getSavedPosts({
        user: req.user,
        query: req.query,
      });
      res.json({
        savedPosts,
        count,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
