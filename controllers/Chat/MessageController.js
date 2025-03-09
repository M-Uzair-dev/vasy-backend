import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";

export const createMessage = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;
    const message = new Message({
      conversation: conversationId,
      sender,
      content,
    });
    await message.save();
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: message._id },
      { new: true }
    );
    res.status(201).json({ message, conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      conversation: conversationId,
    }).populate("sender conversation");
    const conversation = await Conversation.findById(conversationId).populate(
      "participant lastMessage"
    );

    res.status(200).json({ messages, conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
