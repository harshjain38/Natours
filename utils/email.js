const nodemailer=require('nodemailer');

const sendEmail =async options => {
    // 1) Create a transporter
    const transporter=nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_HOSTNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    // 2) Create Options
    const mailOptions={
        from: 'Harsh Jain <harsh@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) Send the email
    await transporter.sendMail(mailOptions);
};

module.exports=sendEmail;