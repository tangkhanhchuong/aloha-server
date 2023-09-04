const Users = require('../models/user.model')
const Posts = require('../models/post.model')
const { getPresignedUrl } = require('../middleware/s3')
const { APIFeatures } = require('../utils/APIFeatures')

const userService = require('../services/user.service')

const userController = {
    search: async (req, res, next) => {
        try {
            const users = await Users
                .find({
                    username: {
                        $regex: req.query.username || '',
                    },

                })
                .limit(10)
                .select('fullname username avatar')
            
            const formattedUsers = await Promise.all(users.map(async (user) => ({
                ...user._doc,
                avatar: await getPresignedUrl(user.avatar)
            })))

            return res.json({
                users: formattedUsers
            })
        } catch (err) {
            next(err)
        }
    },

    get: async (req, res, next) => {
        try {
            const user = await Users
                .findById(req.params.id)
                .select('-password')
                .populate('followers following', '-password')
            if(!user) {
                return res.status(400).json({ msg: 'User does not exist.' })
            }
            user.avatar = await getPresignedUrl(user.avatar)
            return res.json({ user })
        } catch (err) {
            next(err)
        }
    },

    update: async (req, res, next) => {
        try {
            const { avatar, fullname, mobile, address, story, website, gender } = req.body
            if(!fullname) {
                return res.status(400).json({ msg: 'Please add your full name.' })
            }

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                avatar, fullname, mobile, address, story, website, gender
            })

            return res.json({ msg: 'Update Success!' })
        } catch (err) {
            next(err)
        }
    },

    follow: async (req, res, next) => {
        try {
            const user = await Users.find({ _id: req.params.id, followers: req.user._id })
            if(user.length > 0) {
                return res.status(400).json({ msg: 'You followed this user.' })
            }

            const updatedUser = await Users.findOneAndUpdate({ _id: req.params.id }, { 
                $push: { followers: req.user._id }
            }, { new: true }).populate('followers following', '-password')

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { following: req.params.id }
            }, { new: true })
            
            updatedUser.avatar = await getPresignedUrl(updatedUser.avatar)
            updatedUser.followers = await Promise.all(updatedUser.followers.map(async (follower) => {
                follower.avatar = await getPresignedUrl(follower.avatar)
                return follower
            }))
            updatedUser.following = await Promise.all(updatedUser.following.map(async (followingUser) => {
                followingUser.avatar = await getPresignedUrl(followingUser.avatar)
                return followingUser
            }))

            return res.json({ user: updatedUser })
        } catch (err) {
            next(err)
        }
    },

    unfollow: async (req, res, next) => {
        try {

            const updatedUser = await Users.findOneAndUpdate({ _id: req.params.id }, { 
                $pull: { followers: req.user._id }
            }, { new: true }).populate('followers following', '-password')

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { following: req.params.id }
            }, { new: true })

            updatedUser.avatar = await getPresignedUrl(updatedUser.avatar)
            updatedUser.followers = await Promise.all(updatedUser.followers.map(async (follower) => {
                follower.avatar = await getPresignedUrl(follower.avatar)
                return follower
            }))
            updatedUser.following = await Promise.all(updatedUser.following.map(async (followingUser) => {
                followingUser.avatar = await getPresignedUrl(followingUser.avatar)
                return followingUser
            }))

            return res.json({ user: updatedUser })
        } catch (err) {
            next(err)
        }
    },

    suggest: async (req, res, next) => {
        try {
            const newArr = [ ...req.user.following, req.user._id ]
            const num  = req.query.num || 10
            const users = await Users
                .aggregate([
                    { $match: { _id: { $nin: newArr } } },
                    { $sample: { size: Number(num) } },
                    { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                    { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
                ]).project('-password')
            const formattedUsers = await Promise.all(users.map(async (user) => ({
                ...user,
                avatar: await getPresignedUrl(user.avatar)
            })))
            return res.json({
                users: formattedUsers,
                count: formattedUsers.length
            })
        } catch (err) {
            next(err)
        }
    },

    getUserPosts: async (req, res, next) => {
        try {
            const features = new APIFeatures(Posts.find({ user: req.params.id }), req.query)
                .paginate()

            const posts = await features.query.sort('-createdAt')
            const formattedPosts = await Promise.all(posts.map(async (post) => {
                post.images = await Promise.all(post.images.map(async (image) => ({
                    key: image,
                    url: await getPresignedUrl(image)
                })))
                return post
            }))
            
            return res.json({
                posts: formattedPosts,
                count: formattedPosts.length
            })
        } catch (err) {
            next(err)
        }
    },

    getDiscoverPosts: async (req, res, next) => {
        try {
            const newArr = [...req.user.following, req.user._id]
            const num  = req.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user : { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Success!',
                count: posts.length,
                posts
            })
        } catch (err) {
            next(err)
        }
    },
    
    getSavedPosts: async (req, res, next) => {
        try {
            const features = new APIFeatures(Posts.find({
                _id: { $in: req.user.saved }
            }), req.query).paginate()

            const savePosts = await features.query.sort('-createdAt')
            res.json({
                savePosts,
                count: savePosts.length
            })
        } catch (err) {
            next(err)
        }
    },
}

module.exports = userController