import Conversation from "../../models/Conversation.js";


export const createConversation = async (req, res) => {
    try {
        const { participants } = req.body;
        const conversation = new Conversation({ participants });
        await conversation.save();
        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await Conversation.find({
            participants: userId,
        }).populate("participants");
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
