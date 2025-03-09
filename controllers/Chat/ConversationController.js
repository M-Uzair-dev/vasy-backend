import Conversation from "../../models/Conversation.js";
import User from "../../models/BaseUser.js";
export const createConversation = async (req, res) => {
  try {
    const participant = req.body.participant;
    const user = await User.findOne({ _id: participant });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let conversation;
    if (["client", "driver", "restaurant"].includes(user.role)) {
      conversation = new Conversation({ participant, type: user.role });
    } else {
      console.log(user.role);
      return res.status(400).json({ error: "Invalid user role" });
    }
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { type } = req.params;
    let conversations = await Conversation.find({
      type,
    }).populate("participant lastMessage");
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
