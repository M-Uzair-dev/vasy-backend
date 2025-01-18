import jwt from 'jsonwebtoken';

const generateResetToken = (userId) => {
    return jwt.sign({ userId }, 'your_jwt_secret', { expiresIn: '1h' }); // Token expires in 1 hour
};

export { generateResetToken };
