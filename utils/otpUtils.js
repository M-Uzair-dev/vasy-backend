const otpStore = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const storeOTP = (email, otp) => {
    otpStore.set(email, otp);
};

const getOTP = (email) => {
    return otpStore.get(email);
};

const deleteOTP = (email) => {
    otpStore.delete(email);
};

export { generateOTP, storeOTP, getOTP, deleteOTP };
