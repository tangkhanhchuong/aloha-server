const Posts = require('../models/post.model')
const Comments = require('../models/comment.model')
const Users = require('../models/user.model')
const { getPresignedUrl } = require('../helpers/s3')
const { APIFeatures } = require('../utils/APIFeatures')
const { addToNotifyQueue } = require('../queues/notify.queue')

const postService = {
	create: async ({ content, images, user }) => {
		const newPost = new Posts({
			content, images, user: user._id
		})
		await newPost.save()

		const formattedImages = await Promise.all(newPost.images.map(async (image) => ({
			key: image,
			url: await getPresignedUrl(image)
		})))

		addToNotifyQueue({
			content,
			user,
			url: `/posts/${newPost._id}`,
			text: 'added a new post.',
			recipients: [ ...user.followers ]
		})

		return {
			newPost: {
				...newPost._doc,
				user,
				images: formattedImages,
			}
		}
	},

	list: async ({ user, query }) => {
		const features =  new APIFeatures(Posts.find({
			user: [...user.following, user._id]
		}), query).paginate()

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
		return { posts: formattedPosts }
	},

	update: async ({ content, images, postId }) => {
		const updatedPost = await Posts
			.findOneAndUpdate({ _id: postId }, {
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
		const post = {
				...updatedPost._doc,
				content,
				images: formattedImages,
		}
		post.user.avatar = await getPresignedUrl(updatedPost.user.avatar)
		return { post }
	},

	get: async ({ id }) => {
		const post = await Posts
			.findById(id)
			.populate('user likes', 'avatar username fullname followers')
			.populate({
				path: 'comments',
				populate: {
					path: 'user likes',
					select: '-password'
				}
			})

		if(!post) {
			const err = new Error('This post does not exist.')
			err.status = 400
			throw err
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

		return { post }
	},

	delete: async ({ id, user }) => {
		const post = await Posts.findOneAndDelete({ _id: id, user: user.id })
		await Comments.deleteMany({ _id: { $in: post.comments } })
		return {
			post : {
				...post,
				user
			}
		}
	},

	like: async ({ postId, user }) => {
		const post = await Posts.find({ _id: postId, likes: user._id })
		if(post.length > 0) {
			const err = new Error('You liked this post.')
			err.status = 400
			throw err
		}
		const updatedPost = await Posts.findOneAndUpdate({ _id: postId }, {
			$push: { likes: user._id }
		}, { new: true })

		if(!updatedPost) {
			const err = new Error('This post does not exist.')
			err.status = 404
			throw err
		}

		addToNotifyQueue({
			user,
			content: updatedPost.content,
			url: `/posts/${updatedPost._id}`,
			recipients: [ updatedPost.user._id ],
			text: 'like your post.',
		})
	},
	
	unlike: async ({ postId, user }) => {
		const updatedPost = await Posts.findOneAndUpdate({ _id: postId }, {
			$pull: { likes: user._id }
		}, { new: true })

		if(!updatedPost) {
			const err = new Error('This post does not exist.')
			err.status = 404
			throw err
		}
	},

	save: async ({ id, userId }) => {
		const user = await Users.find({ _id: userId, saved: id })
		if(user.length > 0) {
			const err = new Error('You saved this post.' )
			err.status = 400
			throw err
		}

		const updatedUser = await Users.findOneAndUpdate({ _id: userId }, {
			$push: { saved: id }
		}, { new: true })

		if(!updatedUser) {
			const err = new Error('This user does not exist.')
			err.status = 404
			throw err
		}
	},
	
	unsave: async ({ id, userId }) => {
		const updatedUser = await Users.findOneAndUpdate({ _id: userId }, {
			$pull: { saved: id }
		}, { new: true })

		if(!updatedUser) {
			const err = new Error('This user does not exist.')
			err.status = 404
			throw err
		}
	},
}

module.exports = postService