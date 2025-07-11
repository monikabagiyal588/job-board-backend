const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASSWORD
  }
});

const sendConfirmationEmail = async (to, jobTitle,resumeUrl) => {
 
  await transporter.sendMail({
    from: '"Job Board" <your-email@gmail.com>',
    to,
    subject: 'Application Submitted',
    html: `<p>Thank you for applying to <strong>${jobTitle}</strong>. We’ve received your resume.</p>`,
    attachments: [
    {
      // filename: 'Monika_Resume.pdf',
      path: resumeUrl, // ✅ public Cloudinary resume URL
    }
  ]
  });
};

module.exports = { sendConfirmationEmail };
