const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(app.settings.nodemailer, {
});

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

module.exports = transporter;
