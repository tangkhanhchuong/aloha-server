const Bull = require('bull')

const notifyService = require('../services/notify.service')

const bullConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
}

const notifyQueue = new Bull('create-notification', bullConfig)

notifyQueue.process((job) => {
  notifyService.create(job.data)
})

const addToNotifyQueue = ({ url, text, content, user, recipients }) => {
  notifyQueue.add({
      url,
      text,
      content,
      user,
      recipients
    }, {
    attempts: 1
  })
}

module.exports = {
  addToNotifyQueue
}