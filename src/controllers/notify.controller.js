const notifyService = require('../services/notify.service')

const notifyController = {
    create: async (req, res, next) => {
        try {
            const { id, recipients, url, text, content } = req.body
            const { notify } = await notifyService.create({
                id, recipients, url, text, content,
                user: req.user 
            })
            return res.json({ notify })
        } catch (err) {
            next(err)
        }
    },

    remove: async (req, res, next) => {
        try {
            const { notify } = await notifyService.remove({
                id: req.params.id,
                url: req.query.url
            })
            
            return res.json({ notify })
        } catch (err) {
            next(err)
        }
    },

    list: async (req, res, next) => {
        try {
            const { notifies } = await notifyService.list({
                userId: req.user._id
            })
            return res.json({ notifies })
        } catch (err) {
            next(err)
        }
    },
    
    markAsRead: async (req, res, next) => {
        try {
            const { notify } = await notifyService.markAsRead({
                id: req.params.id
            })

            return res.json({ notify })
        } catch (err) {
            next(err)
        }
    },
    
    deleteAll: async (req, res, next) => {
        try {
            const { notifies } = await notifyService.deleteAll({
                userId: req.user._id 
            })
            return res.json({ notifies })
        } catch (err) {
            next(err)
        }
    },
}


module.exports = notifyController