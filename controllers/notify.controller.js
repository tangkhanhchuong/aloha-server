const Notifies = require('../models/notify.model')
const { getPresignedUrl } = require('../middleware/s3')


const notifyController = {
    create: async (req, res) => {
        try {
            const { id, recipients, url, text, content } = req.body

            if(recipients.includes(req.user._id.toString())) {
                return;
            }
            const notify = new Notifies({
                id, recipients, url, text, content, user: req.user._id
            })

            await notify.save()
            return res.json({ notify })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    remove: async (req, res) => {
        try {
            const notify = await Notifies.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })
            
            return res.json({ notify })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    list: async (req, res) => {
        try {
            const notifies = await Notifies
                .find({ recipients: req.user._id })
                .sort('-createdAt')
                .populate('user', 'avatar username')
                
            const formattedNotifies = await Promise.all(notifies.map(async (notify) => {
                notify.user.avatar = await getPresignedUrl(notify.user.avatar)
                return notify
            }))
            return res.json({ notifies: formattedNotifies })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    markAsRead: async (req, res) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({ _id: req.params.id }, {
                isRead: true
            })

            return res.json({ notifies })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteAll: async (req, res) => {
        try {
            const notifies = await Notifies.deleteMany({ recipients: req.user._id })
            return res.json({ notifies })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}


module.exports = notifyController