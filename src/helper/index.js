const otpGenerator = require('otp-generator');
const { OTP_LENGTH, SERVICE, USER_NAME, PASSWORD } = require('../constants');
const nodemailer = require("nodemailer");

module.exports.generateOtp = () => {
    return otpGenerator.generate(OTP_LENGTH, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
}

module.exports.sendMail = async (params) => {
    const mainSettings = {
        service: SERVICE,
        auth: {
            user: USER_NAME,
            pass: PASSWORD
        }
    }
    const transporter = nodemailer.createTransport(mainSettings);
    try {
        let html = `${params.otp}`
        let info = await transporter.sendMail({
            from: mainSettings.auth.user,
            to: params.to,
            subject: "Welcome to Pikaso",
            html: html
        })
        return info;
    } catch (error) {
        console.log("Error", error);
        return false;
    }
}