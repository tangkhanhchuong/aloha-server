const Conversations = require('../models/conversation.model')
const Messages = require('../models/message.model')
const { APIFeatures } = require('../utils/APIFeatures')


const messageService = {
	create: async ({ sender, recipient, text, media, call }) => {
		if(!recipient || (!text.trim() && media.length === 0 && !call)) {
			return;
		}

		const newConversation = await Conversations.findOneAndUpdate({
				$or: [
						{ recipients: [ sender, recipient ] },
						{ recipients: [ recipient, sender ] }
				]
		}, {
				recipients: [ sender, recipient ],
				text, media, call
		}, { new: true, upsert: true })

		const newMessage = new Messages({
				conversation: newConversation._id,
				sender,
				call,
				recipient,
				text,
				media
		})
		await newMessage.save()
	},

	list: async ({ id, userId, query }) => {
		const features = new APIFeatures(Messages.find({
			$or: [
				{ sender: userId, recipient: id },
				{ sender: id, recipient: userId}
			]
		}), query).paginate()
		const messages = await features.query.sort('-createdAt')
		return { messages }
	},

	delete: async ({ id, userId }) => {
		await Messages.findOneAndDelete({
			_id: id,
			sender: userId
		})
	},
}

module.exports = messageService