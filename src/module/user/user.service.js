const { StatusCodes } = require('http-status-codes');
const _ = require('lodash')

const Users = require('./user.model');
const Posts = require('../post/post.model');
const { getPresignedUrl } = require('../../core/aws/s3');
const { APIFeatures } = require('../../shared/APIFeatures');
const { addToNotificationQueue } = require('../notification/notification.queue');

const userService = {
  search: async ({ username }) => {
    const users = await Users.find({
      username: {
        $regex: username || '',
      },
    })
      .limit(10)
      .select('fullname username avatar');

    const formattedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user._doc,
        avatar: await getPresignedUrl(user.avatar),
      }))
    );
    return { users: formattedUsers };
  },

  suggest: async ({ user, query }) => {
    const newArr = [...user.following, user._id];
    const num = query.num || 10;
    const users = await Users.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: 'users',
          localField: 'followers',
          foreignField: '_id',
          as: 'followers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'following',
          foreignField: '_id',
          as: 'following',
        },
      },
    ]).project('-password');
    const formattedUsers = await Promise.all(
      users.map(async (formattedUser) => ({
        ...formattedUser,
        avatar: await getPresignedUrl(formattedUser.avatar),
      }))
    );
    return { users: formattedUsers };
  },

  getSavedPosts: async ({ user, query }) => {
    const condition = {
      _id: { $in: user.saved },
    }
    const features = new APIFeatures(
      Posts.find(condition),
      query
    ).paginate();

    const posts = await features.query
      .sort('-createdAt')
      .populate('likes user', '-password')
      .populate({
        path: 'comments',
        populate: {
          path: 'user likes',
          select: '-password',
        },
      });;
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        post.images = await Promise.all(
          post.images.map(async (image) => ({
            key: image,
            url: await getPresignedUrl(image),
          }))
          );
        const avatar = await getPresignedUrl(post.user.avatar);
        post.comments = await Promise.all(
          post.comments.map(async (comment) => {
            const commentAvatar = await getPresignedUrl(comment.user.avatar);
            comment.user = {
              ...comment.user._doc,
              avatar: commentAvatar,
            };
            return comment;
          })
        );
        post.user = {
          ...post.user._doc,
          avatar,
        };
        return post;
      })
    );
    const count = await Posts.countDocuments(condition)
    return { count, savedPosts: formattedPosts };
  },

  getDiscoverPosts: async ({ user, query }) => {
    const newArr = [...user.following, user._id];
    const num = query.num || 9;

    const posts = await Posts.aggregate([
      { $match: { user: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
    ]);
    return { posts };
  },

  get: async ({ id }) => {
    const user = await Users.findById(id)
      .select('-password')
      .populate('followers following', '-password');
    if (!user) {
      const err = new Error('User does not exist.');
      err.status = StatusCodes.NOT_FOUND;
      throw err;
    }
    user.avatar = await getPresignedUrl(user.avatar);
    return { user };
  },

  update: async ({
    avatar,
    fullname,
    mobile,
    address,
    story,
    website,
    gender,
    userId,
  }) => {
    if (!fullname) {
      const err = new Error('Missing fullname !');
      err.status = StatusCodes.BAD_REQUEST;
      throw err;
    }
    console.log({
      avatar,
      fullname,
      mobile,
      address,
      story,
      website,
      gender,
      userId,
    })

    await Users.findOneAndUpdate(
      { _id: userId },
      _.omitBy({
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
      }, _.isNil)
    );
  },

  follow: async ({ id, userId }) => {
    const user = await Users.find({ _id: id, followers: userId });
    if (user.length > 0) {
      const err = new Error('You followed this user.');
      err.status = StatusCodes.BAD_REQUEST;
      throw err;
    }

    const updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $push: { followers: userId },
      },
      { new: true }
    ).populate('followers following', '-password');

    await Users.findOneAndUpdate(
      { _id: userId },
      {
        $push: { following: id },
      },
      { new: true }
    );

    updatedUser.avatar = await getPresignedUrl(updatedUser.avatar);
    updatedUser.followers = await Promise.all(
      updatedUser.followers.map(async (follower) => {
        follower.avatar = await getPresignedUrl(follower.avatar);
        return follower;
      })
    );
    updatedUser.following = await Promise.all(
      updatedUser.following.map(async (followingUser) => {
        followingUser.avatar = await getPresignedUrl(followingUser.avatar);
        return followingUser;
      })
    );

    addToNotificationQueue({
      user: { _id: userId },
      text: 'has started to follow you.',
      url: `/profile/${userId}`,
      recipients: [updatedUser._id],
    });

    return { user: updatedUser };
  },

  unfollow: async ({ id, userId }) => {
    const updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $pull: { followers: userId },
      },
      { new: true }
    ).populate('followers following', '-password');

    await Users.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { following: id },
      },
      { new: true }
    );

    updatedUser.avatar = await getPresignedUrl(updatedUser.avatar);
    updatedUser.followers = await Promise.all(
      updatedUser.followers.map(async (follower) => {
        follower.avatar = await getPresignedUrl(follower.avatar);
        return follower;
      })
    );
    updatedUser.following = await Promise.all(
      updatedUser.following.map(async (followingUser) => {
        followingUser.avatar = await getPresignedUrl(followingUser.avatar);
        return followingUser;
      })
    );
    return { user: updatedUser };
  },

  getUserPosts: async ({ user, query }) => {
    const features = new APIFeatures(Posts.find({ user }), query).paginate();
    const posts = await features.query
      .sort('-createdAt')
      .populate('likes user', '-password')
      .populate({
        path: 'comments',
        populate: {
          path: 'user likes',
          select: '-password',
        },
      });
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        post.images = await Promise.all(
          post.images.map(async (image) => ({
            key: image,
            url: await getPresignedUrl(image),
          }))
          );
        const avatar = await getPresignedUrl(post.user.avatar);
        post.comments = await Promise.all(
          post.comments.map(async (comment) => {
            const commentAvatar = await getPresignedUrl(comment.user.avatar);
            comment.user = {
              ...comment.user._doc,
              avatar: commentAvatar,
            };
            return comment;
          })
        );
        post.user = {
          ...post.user._doc,
          avatar,
        };
        return post;
      })
    );
    const count = await Posts.countDocuments({ user })
    return { count, posts: formattedPosts };
  },
};

module.exports = userService;
