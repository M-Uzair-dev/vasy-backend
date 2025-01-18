import Client from "../../models/Client.js";

export const addClient = async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).json({ message: "Client successfully added", client });
    } catch (error) {
        res.status(400).json({ message: `Error adding client: ${error.message}` });
    }
};

export const editClient = async (req, res) => {
    try {
        const { id } = req.query;
        const client = await Client.findByIdAndUpdate(id, req.body, { new: true });
        if (!client) return res.status(404).json({ message: 'Client not found' });

        res.json({ message: "Client successfully updated", client });
    } catch (error) {
        res.status(400).json({ message: `Error updating client: ${error.message}` });
    }
};

export const getClient = async (req, res) => {
    try {
        const { id } = req.query;
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndDelete(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
