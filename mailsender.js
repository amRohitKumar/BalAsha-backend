"use strict";
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async ({ to_mail, name, taskName }) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODEMAILER_GMAIL,
      pass: process.env.NODEMAILER_GMAIL_PASSWORD,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views/"),
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: process.env.NODEMAILER_GMAIL,
    to: to_mail,
    subject: "Reminder: Pending Task",
    template: "emailView",
    context: {
      name,
      taskName,
    },
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: ' + info.response);
  // console.log(info);
};

module.exports = sendMail;
