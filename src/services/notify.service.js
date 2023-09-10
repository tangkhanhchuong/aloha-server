const Notifies = require('../models/notify.model')
const { getPresignedUrl } = require('../helpers/s3')
const { getIo, getSocketUserById, getRoomName } = require('../helpers/socket')

const notifyService = {
	create: async ({ recipients, url, text, content, user }) => {
		if (recipients.length < 1) {
			return null
		}
		if(recipients.includes(user._id.toString())) {
				return
		}
		const createdNotify = new Notifies({
			recipients, url, text, content, user: user._id
		})
		await createdNotify.save()

		const formattedRecipients = await Promise.all(recipients.map(async (recipient) => {
			recipient.avatar = await getPresignedUrl(recipient.avatar)
			return recipient
		}))
		for (const recipient of formattedRecipients) {
			const user = await getSocketUserById(recipient)
			if (!user) {
				continue
			}
			const io = getIo()
			io.to(getRoomName(user.id)).emit('send_notifcation', {
				_id: createdNotify._id, recipients, url, text, content, user
			})
		}
		return { notify: createdNotify }
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