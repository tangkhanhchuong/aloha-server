const Bull = require("bull");

const notificationService = require("../services/notification.service");
const { logger } = require("../helpers/logger");

const bullConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

const notificationQueue = new Bull("create-notification", bullConfig);

notificationQueue.process((job) => {
  notificationService.create(job.data);
});

const addToNotificationQueue = ({ url, text, content, user, recipients }) => {
  logger.info(
    JSON.stringify({
      msg: "Add to queue",
      payload: { url, text, content, user, recipients },
    })
  );
  notificationQueue.add(
    {
      url,
      text,
      content,
      user,
      recipients,
    },
    {
      attempts: 1,
    }
  );
};

module.exports = {
  addToNotificationQueue,
};
