const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
    "284416396339-t546r7j0ni89d68c7mq5838t89pokt8r.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
    "1//04QjZ1wds6QQtCgYIARAAGAQSNwF-L9IrQjGySD7uSq1UCr8sROgxIw064_h8bQZXB0YZQWoqdjVWOhzFrj8rLwWjHe61bMhAPaQ";

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
        text: `Click this link to verify your account http://localhost:8000/auth/verify?token=${token}&email=${to}`,
    };

    const result = transport.sendMail(mailOptions);
    return result;
};
