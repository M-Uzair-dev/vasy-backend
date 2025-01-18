import Bank from "../../models/Bank.js";


export const getBanks = async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            const bank = await Bank.findById(id);
            if (!bank) {
                return res.status(404).json({ message: 'Bank not found' });
            }
            return res.status(200).json(bank);
        }

        const banks = await Bank.find();
        if (banks.length === 0) {
            return res.status(404).json({ message: 'No banks found' });
        }
        res.status(200).json(banks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createBank = async (req, res) => {
    try {
        const { userId, bankName, branchName, holderName, accountNo, ibanNo } = req.body;
        if (!userId || !bankName || !branchName || !holderName || !accountNo || !ibanNo) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const existingBank = await Bank.findOne({ accountNo });
        if (existingBank) {
            return res.status(409).json({ message: 'Account number already exists' });
        }

        const newBank = new Bank(req.body);
        const savedBank = await newBank.save();
        res.status(201).json({ message: 'Bank created successfully', data: savedBank });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateBank = async (req, res) => {
    try {
        const { id } = req.query;
        const updatedBank = await Bank.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json({ message: 'Bank updated successfully', data: updatedBank });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteBank = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedBank = await Bank.findByIdAndDelete(id);
        if (!deletedBank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json({ message: 'Bank deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
