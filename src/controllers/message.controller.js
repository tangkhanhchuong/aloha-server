const messageService = require('../services/message.service')

const messageController = {
	create: async (req, res, next) => {
		try {
			const { sender, recipient, text, media, call } = req.body
			await messageService.create({
				sender, recipient, text, media, call
			})

			return res.json({ msg: 'Create Success!' })
		} catch (err) {
			next(err)
		}
	},

	list: async (req, res, next) => {
		try {
			const { messages } = await messageService.list({
				id: req.params.id,
				userId: req.user._id,
				query: req.query
			})
			return res.json({
				messages,
				count: messages.length
			})
		} catch (err) {
			next(err)
		}
	},

	delete: async (req, res, next) => {
		try {
			await messageService.delete({
				id: req.params.id,
				userId: req.user._id
			})
			return res.json({ msg: 'Delete Success!' })
		} catch (err) {
			next(err)
		}
	},
}


module.exports = messageController