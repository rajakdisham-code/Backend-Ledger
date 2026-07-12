require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({  //sender details
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});




// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail , name){
    const subject = "Welcome to Backend Ledger!";
    const text = `Hi ${name},\n\nThank you for registering with Backend Ledger. We're excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering with Backend Ledger. We're excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail , name){
    const subject = "Login Successful - Backend Ledger";
    const text = `Hi ${name},\n\nYou have successfully logged into your Backend Ledger account. If this wasn't you, please change your password immediately.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>You have successfully logged into your Backend Ledger account. If this wasn't you, please change your password immediately.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail , name , amount , toAccount){
    const subject = "Transaction Successful - Backend Ledger";
    const text = `Hi ${name},\n\nYour transaction has been completed successfully!\n\nTransaction Details:\nAmount: ${amount}\nTo Account: ${toAccount}\n\nThank you for using Backend Ledger.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Your transaction has been completed successfully!</p><p><strong>Transaction Details:</strong></p><p>Amount: ${amount}<br>To Account: ${toAccount}</p><p>Thank you for using Backend Ledger.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail , name , amount , fromAccount){
    const subject = "Transaction Failed - Backend Ledger";
    const text = `Hi ${name},\n\nUnfortunately, your transaction could not be completed.\n\nTransaction Details:\nAmount: ${amount}\nFrom Account: ${fromAccount}\n\nPlease check your account details and try again. If the issue persists, contact our support team.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Unfortunately, your transaction could not be completed.</p><p><strong>Transaction Details:</strong></p><p>Amount: ${amount}<br>From Account: ${fromAccount}</p><p>Please check your account details and try again. If the issue persists, contact our support team.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail, sendLoginEmail, sendTransactionEmail, sendTransactionFailureEmail };