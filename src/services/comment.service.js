const Comments = require('../models/comment.model')
const Posts = require('../models/post.model')
const { addToNotifyQueue } = require('../queues/notify.queue')

const commentService = {
	create: async ({ postId, content, tag, reply, postUserId, userId }) => {
		const post = await Posts.findById(postId)
		if(!post) {
				const err = new Error('This post does not exist.')
				err.status = 404
				throw err
		}

		if(reply){
				const cm = await Comments.findById(reply)
				if(!cm) {
						const err = new Error('This comment does not exist.')
						err.status = 404
						throw err
				}
		}

		const newComment = new Comments({
				content, tag, reply, postUserId, postId,
				user: userId
		})

		await Posts.findOneAndUpdate({ _id: postId }, {
				$push: { comments: newComment._id }
		}, { new: true })
		await newComment.save()

		addToNotifyQueue({
			text: newComment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
			recipients: newComment.reply ? [ newComment.tag._id ] : [ post.user._id ],
			url: `/posts/${post._id}`,
			content: newComment.content,
			user: { _id: userId }
		})

		return { newComment }
	},

	update: async ({ content, id, userId }) => {
		await Comments.findOneAndUpdate({
			_id: id, user: userId
		}, { content })
	},

	like: async ({ id, userId }) => {
		const comment = await Comments.find({ _id: id, likes: userId })
		if(comment.length > 0) {
			const err = new Error('You liked this post.')
			err.status = 400
			throw err
		}

		await Comments.findOneAndUpdate({ _id: id }, {
				$push: { likes: userId }
		}, { new: true })
	},

	unlike: async ({ id, userId }) => {
		await Comments.findOneAndUpdate({ _id: id}, {
			$pull: { likes: userId }
		}, { new: true })
	},

	delete: async ({ id, userId }) => {
		const comment = await Comments.findOneAndDelete({
			_id: id,
			$or: [
				{ user: userId },
				{ postUserId: userId }
			]
		})
		await Posts.findOneAndUpdate({ _id: comment.postId }, {
				$pull: { comments: req.params.id }
		})
	},
}

module.exports = commentService