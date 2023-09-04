const Conversations = require('../models/conversation.model')
const Messages = require('../models/message.model')
const { APIFeatures } = require('../utils/APIFeatures')

const messageController = {
    create: async (req, res) => {
        try {
            const { sender, recipient, text, media, call } = req.body

            if(!recipient || (!text.trim() && media.length === 0 && !call)) {
                return;
            }

            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    { recipients: [sender, recipient] },
                    { recipients: [recipient, sender] }
                ]
            }, {
                recipients: [sender, recipient],
                text, media, call
            }, { new: true, upsert: true })

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender, call,
                recipient, text, media
            })

            await newMessage.save()
            return res.json({ msg: 'Create Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    list: async (req, res) => {
        try {
            const features = new APIFeatures(Messages.find({
                $or: [
                    {sender: req.user._id, recipient: req.params.id},
                    {sender: req.params.id, recipient: req.user._id}
                ]
            }), req.query).paginate()

            const messages = await features.query.sort('-createdAt')
            return res.json({
                messages,
                result: messages.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res) => {
        try {
            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id })
            return res.json({ msg: 'Delete Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}


module.exports = messageController