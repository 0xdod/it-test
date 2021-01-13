'use strict';
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const mailgunAuth = {
  auth: {
    api_key: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

function sendMail(from, to, subject, text, html) {
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(mg(mailgunAuth));

    const env = process.env.NODE_ENV;

    if (env === 'test') {
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    }

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      //html: '<b>Hello world?</b>', // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);
}

module.exports = { sendMail };
