const Notifies = require('../models/notify.model')
const { getPresignedUrl } = require('../middleware/s3')

const notifyService = {
	create: async ({ id, recipients, url, text, content, userId }) => {
		if(recipients.includes(userId.toString())) {
				return;
		}
		const notify = new Notifies({
				id, recipients, url, text, content, user: userId
		})
		await notify.save()
		return { notify }
	},

	remove: async ({ id, url }) => {
		const notify = await Notifies.findOneAndDelete({
			id, url
		})
		return { notify }
	},

	list: async ({ userId }) => {
		const notifies = await Notifies
			.find({ recipients: userId })
			.sort('-createdAt')
			.populate('user', 'avatar username')
		
		const formattedNotifies = await Promise.all(notifies.map(async (notify) => {
			notify.user.avatar = await getPresignedUrl(notify.user.avatar)
			return notify
		}))
		return { notifies: formattedNotifies }
	},

	markAsRead: async ({ id }) => {
		const notify = await Notifies.findOneAndUpdate({ _id: id }, {
			isRead: true
		})
		return { notify }
	},

	deleteAll: async ({ userId }) => {
		const notifies = await Notifies.deleteMany({ recipients: userId })
		return { notifies }
	},
}

module.exports = notifyService