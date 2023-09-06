const Bull = require('bull')

const notifyService = require('../services/notify.service')

const notifyQueue = new Bull('notify', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
})

notifyQueue.process((job) => {
  notifyService.create(job.data)
})

const sendNotification = ({ id, url, text, content, user }) => {
  notifyQueue.add({
      id,
      url,
      text,
      content,
      user,
      recipients: [ ...user.followers ],
    }, {
    attempts: 1
  })
}

module.exports = {
  sendNotification
}
