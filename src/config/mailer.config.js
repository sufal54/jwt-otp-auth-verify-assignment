import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.MAILID,
        pass: process.env.MAILKEY,
    },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(email, otp) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: `${email}`, // list of receivers
        subject: "OTP ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<h1>otp is ${otp}</h1>`, // html body
    });

}
