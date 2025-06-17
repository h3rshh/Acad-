const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try{
        console.log("Entered MailSender, title and body : ", title, " ", body)
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            logger: true,
        })

        let info = await transporter.sendMail({
            from: 'Acad+',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        // console.log("Mail info : ", info)
        return info
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = mailSender;