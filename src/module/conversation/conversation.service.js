const { getPresignedUrl } = require("../../core/aws/s3");
const Conversations = require("./conversation.model");
const Messages = require("../message/message.model");
const { APIFeatures } = require("../../shared/APIFeatures");

const conversationService = {
  list: async ({ userId, query }) => {
    const features = new APIFeatures(
      Conversations.find({
        recipients: userId,
      }),
      query
    ).paginate();

    const conversations = await features.query
      .sort("-updatedAt")
      .populate("recipients", "avatar username fullname");

    const formattedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        conversation.recipients = await Promise.all(
          conversation.recipients.map(async (recipent) => {
            recipent.avatar = await getPresignedUrl(recipent.avatar);
            return recipent;
          })
        );
        return conversation;
      })
    );
    return { conversations: formattedConversations };
  },

  delete: async ({ id, userId }) => {
    const newConver = await Conversations.findOneAndDelete({
      $or: [{ recipients: [userId, id] }, { recipients: [id, userId] }],
    });
    await Messages.deleteMany({ conversation: newConver._id });
  },
};

module.exports = conversationService;
