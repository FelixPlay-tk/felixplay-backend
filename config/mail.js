const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
    "405665757399-i6ag3obsava4mk9hr1cpaqqkivg3rjj0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
    "1//04qPZ-u6SMfMFCgYIARAAGAQSNwF-L9Ir1zcdiJhCush1UyQdAzu2mc_c8i2unYFqrFTqhuM23LiB1-r1AniQGYrXZCw8LZI0hck";

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.sendVerificationLink = (to, token) => {
    const accessToken = oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "officialfelixplay@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const mailOptions = {
        from: "FelixPlay <noreply@felixplay.tk>",
        to: to,
        subject: "Verify Email",
        text: `Use this OTP to Verify your Account - ${token}`,
    };

    const result = transport.sendMail(mailOptions);
    return result;
};

exports.sendResetPasswordMail = async (to, token) => {
    const accessToken = oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "officialfelixplay@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const mailOptions = {
        from: "FelixPlay <noreply@felixplay.tk>",
        to: to,
        subject: "Reset Password",
        text: `Visit this link to reset your password http://localhost:3000/resetpassword?token=${token}`,
    };

    return transport.sendMail(mailOptions);
};
