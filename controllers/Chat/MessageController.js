import Message from "../../models/Message.js";

export const createMessage = async (req, res) => {
    try {
        const { conversationId, sender, content } = req.body;
        const message = new Message({ conversation: conversationId, sender, content });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId }).populate("sender");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
