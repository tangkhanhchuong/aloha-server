const { getPresignedUrl } = require('../middleware/s3');
const Conversations = require('../models/conversation.model')
const Messages = require('../models/message.model')
const { APIFeatures } = require('../utils/APIFeatures')

const conversationController = {
    list: async (req, res) => {
        try {
            const features = new APIFeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).paginate()

            const conversations = await features.query
                .sort('-updatedAt')
                .populate('recipients', 'avatar username fullname')

            const formattedConversations = await Promise.all(conversations.map(async (conversation) => {
                conversation.recipients = await Promise.all(conversation.recipients.map(async (recipent) => {
                    recipent.avatar = await getPresignedUrl(recipent.avatar)
                    return recipent
                }))
                return conversation
            }))

            return res.json({
                conversations: formattedConversations,
                result: conversations.length
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            })
            await Messages.deleteMany({ conversation: newConver._id })
            return res.json({ msg: 'Delete Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}


module.exports = conversationController