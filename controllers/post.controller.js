const Posts = require('../models/post.model')
const Comments = require('../models/comment.model')
const Users = require('../models/user.model')
const { getPresignedUrl } = require('../middleware/s3')
const { APIFeatures } = require('../utils/APIFeatures')

const postController = {
    create: async (req, res) => {
        try {
            const { content, images } = req.body
            if(images.length === 0) {
                return res.status(400).json({ msg: 'Please add your photo.' })
            }

            const newPost = new Posts({
                content, images, user: req.user._id
            })
            await newPost.save()

            const formattedImages = await Promise.all(newPost.images.map(async (image) => ({
                key: image,
                url: await getPresignedUrl(image)
            })))

            return res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost._doc,
                    images: formattedImages,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    list: async (req, res) => {
        try {
            const features =  new APIFeatures(Posts.find({
                user: [...req.user.following, req.user._id]
            }), req.query).paginate()

            const posts = await features.query.sort('-createdAt')
                .populate('user likes', 'avatar username fullname followers')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user likes',
                        select: '-password'
                    }
                })
            const formattedPosts = await Promise.all(posts.map(async (post) => {
                post.images = await Promise.all(post.images.map(async (image) => ({
                    key: image,
                    url: await getPresignedUrl(image)
                })))
                post.user.avatar = await getPresignedUrl(post.user.avatar)
                post.comments = await Promise.all(post.comments.map(async (comment) => {
                    comment.user.avatar = await getPresignedUrl(comment.user.avatar)
                    return comment
                }))
                return post
            }))

            return res.json({
                msg: 'Success!',
                result: formattedPosts.length,
                posts: formattedPosts
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    update: async (req, res) => {
        try {
            const { content, images } = req.body

            const post = await Posts
                .findOneAndUpdate({ _id: req.params.id}, {
                    content, images
                })
                .populate('user likes', 'avatar username fullname')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user likes',
                        select: '-password'
                    }
                })

            const formattedImages = await Promise.all(images.map(async (image) => ({
                key: image,
                url: await getPresignedUrl(image)
            })))
            const newPost = {
                ...post._doc,
                content,
                images: formattedImages,
            }
            newPost.user.avatar = await getPresignedUrl(post.user.avatar)
            return res.json({
                msg: 'Updated Post!',
                newPost
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    like: async (req, res) => {
        try {
            const post = await Posts.find({ _id: req.params.id, likes: req.user._id })
            if(post.length > 0) {
                return res.status(400).json({ msg: 'You liked this post.' })
            }

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user._id }
            }, { new: true })

            if(!like) {
                return res.status(400).json({ msg: 'This post does not exist.' })
            }

            return res.json({ msg: 'Liked Post!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unlike: async (req, res) => {
        try {
            const like = await Posts.findOneAndUpdate({ _id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true })

            if(!like) {
                return res.status(400).json({ msg: 'This post does not exist.' })
            }

            return res.json({ msg: 'UnLiked Post!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    get: async (req, res) => {
        try {
            const post = await Posts
                .findById(req.params.id)
                .populate('user likes', 'avatar username fullname followers')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user likes',
                        select: '-password'
                    }
                })

            if(!post) {
                return res.status(400).json({ msg: 'This post does not exist.' })
            }
            const formattedImages = await Promise.all(post.images.map(async (image) => ({
                key: image,
                url: await getPresignedUrl(image)
            })))
            post.images = formattedImages
            post.user.avatar = await getPresignedUrl(post.user.avatar)

            post.comments = await Promise.all(post.comments.map(async (comment) => {
                comment.user.avatar = await getPresignedUrl(comment.user.avatar)
                return comment
            }))

            return res.json({
                post
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            await Comments.deleteMany({ _id: { $in: post.comments } })

            return res.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    save: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id })
            if(user.length > 0) {
                return res.status(400).json({ msg: 'You saved this post.' })
            }

            const save = await Users.findOneAndUpdate({ _id: req.user._id}, {
                $push: { saved: req.params.id }
            }, {new: true })

            if(!save) {
                return res.status(400).json({ msg: 'This user does not exist.' })
            }

            res.json({ msg: 'Saved Post!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    
    unsave: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { saved: req.params.id }
            }, {new: true })

            if(!save) {
                return res.status(400).json({ msg: 'This user does not exist.' })
            }
            res.json({ msg: 'Unsaved Post!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = postController