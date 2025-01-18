import User from './user.js';
import { hashPassword, comparePasswords } from '../utilities/passwordUtils.js';
import jwt from 'jsonwebtoken';
import { generateResetToken } from '../utilities/tokenUtils.js';
import { sendResetLink } from '../utilities/emailUtils.js';
import { generateOTP, storeOTP } from '../utilities/otpUtils.js';

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, type, dateOfBirth, phoneNumber, CNIC } = req.body;
        const hashedPassword = await hashPassword(password);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            type: type || 'CLIENT',
            dateOfBirth: dateOfBirth || '',
            phoneNumber: phoneNumber || '',
            CNIC: CNIC || ''  // Added CNIC handling
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret'); // No expiration
    res.json({ token });
};



const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = generateResetToken(user._id);
    const resetLink = `http://yourfrontend.com/reset-password/${resetToken}`;

    try {
        await sendResetLink(email, resetLink);
        res.json({ message: 'Reset link sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const userId = decoded.userId;
        const hashedPassword = await hashPassword(newPassword);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
const sendOTP = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    storeOTP(email, otp);
    const otpMessage = `Your OTP for account verification is: ${otp}`;

    try {
        await sendResetLink(email, otpMessage);
        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { registerUser, loginUser, forgotPassword, changePassword, resetPassword, sendOTP };
