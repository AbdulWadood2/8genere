const nodemailer = require("nodemailer");
// const pug = require("pug");
const { htmlForOTP } = require("./html");
let Email = class Email {
  constructor(user, resetcode) {
    this.to = user.email;
    this.username = user.name.split(" ")[0];
    this.resetcode = resetcode;
    this.from = `${process.env.clientEmail}`;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.clientEmail,
        pass: process.env.email_pass_key,
      },
    });
  }
  async send() {
    const mailOptions = {
      from: "8Genere app",
      to: this.to,
      subject: "8Genere verification code",
      html: htmlForOTP.replace("#code#", this.resetcode),
    };

    await this.newTransport().sendMail(mailOptions);
  }
  async sendVerificationCode() {
    await this.send();
  }
};

module.exports = {
  Email,
};
