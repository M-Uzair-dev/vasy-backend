import nodemailer from 'nodemailer';

const sendResetLinkforReset = async (email, subject, message) => {
    console.log(email, subject, message)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'asmamughal097@gmail.com',
            //zblt dhqk mfna mpym
            pass: 'zbltdhqkmfnampym'
        }
    });

    const mailOptions = {
        from: 'asmamughal097@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `${message}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error', error)
                reject(new Error('Error sending email'));
            } else {
                console.log(info)
                resolve('Reset link sent');
            }
        });
    });
};

export { sendResetLinkforReset };
