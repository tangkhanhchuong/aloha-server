const Notifications = require("../models/notification.model");
const { getPresignedUrl } = require("../helpers/s3");
const { getIo, getSocketUserById, getRoomName } = require("../helpers/socket");

const notificationService = {
  create: async ({ recipients, url, text, content, user }) => {
    if (recipients.length < 1) return null;
	
    if (recipients.includes(user._id.toString())) return;

    const createdNotification = new Notifications({
      recipients,
      url,
      text,
      content,
      user: user._id,
    });
    await createdNotification.save();

    const formattedRecipients = await Promise.all(
      recipients.map(async (recipient) => {
        recipient.avatar = await getPresignedUrl(recipient.avatar);
        return recipient;
      })
    );
    for (const recipient of formattedRecipients) {
      const user = await getSocketUserById(recipient);
      if (!user) continue;
      const io = getIo();
      io.to(getRoomName(user.id)).emit("send_notifcation", {
        _id: createdNotification._id,
        recipients,
        url,
        text,
        content,
        user,
      });
    }
    return { notification: createdNotification };
  },

  remove: async ({ id, url }) => {
    const notification = await Notifications.findOneAndDelete({
      id,
      url,
    });
    return { notification };
  },

  list: async ({ userId }) => {
    const notifications = await Notifications.find({ recipients: userId })
      .sort("-createdAt")
      .populate("user", "avatar username");

    const formattedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        notification.user.avatar = await getPresignedUrl(notification.user.avatar);
        return notification;
      })
    );
    return { notifications: formattedNotifications };
  },

  markAsRead: async ({ id }) => {
    const notification = await Notifications.findOneAndUpdate(
      { _id: id },
      {
        isRead: true,
      }
    );
    return { notification };
  },

  deleteAll: async ({ userId }) => {
    const notifications = await Notifications.deleteMany({ recipients: userId });
    return { notifications };
  },
};

module.exports = notificationService;
