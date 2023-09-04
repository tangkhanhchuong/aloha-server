const Comments = require('../models/comment.model')
const Posts = require('../models/post.model')


const commentController = {
    create: async (req, res) => {
        try {
            const { postId, content, tag, reply, postUserId } = req.body

            const post = await Posts.findById(postId)
            if(!post) {
                return res.status(400).json({ msg: 'This post does not exist.' })
            }

            if(reply){
                const cm = await Comments.findById(reply)
                if(!cm) {
                    return res.status(400).json({ msg: 'This comment does not exist.' })
                }
            }

            const newComment = new Comments({
                user: req.user._id, content, tag, reply, postUserId, postId
            })

            await Posts.findOneAndUpdate({_id: postId}, {
                $push: {comments: newComment._id}
            }, { new: true })
            await newComment.save()

            return res.json({ newComment })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    update: async (req, res) => {
        try {
            const { content } = req.body
            
            await Comments.findOneAndUpdate({
                _id: req.params.id, user: req.user._id
            }, { content })
            return res.json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    like: async (req, res) => {
        try {
            const comment = await Comments.find({ _id: req.params.id, likes: req.user._id })
            if(comment.length > 0) return res.status(400).json({ msg: 'You liked this post.' })

            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $push: {likes: req.user._id}
            }, { new: true })

            return res.json({ msg: 'Liked Comment!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unlike: async (req, res) => {
        try {
            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user._id }
            }, { new: true })

            return res.json({ msg: 'UnLiked Comment!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res) => {
        try {
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    { user: req.user._id },
                    { postUserId: req.user._id }
                ]
            })

            await Posts.findOneAndUpdate({ _id: comment.postId }, {
                $pull: { comments: req.params.id }
            })
            return res.json({ msg: 'Deleted Comment!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}


module.exports = commentController