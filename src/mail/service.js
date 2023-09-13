const nodemailer = require('nodemailer');
const emailServiceInteface = {
    sendEmail: async function (to, subject, email) { },
};
emailServiceInteface.transport;
emailServiceInteface.from;

class emailService {
    constructor(user, password, host, from, port) {
        this.transport = nodemailer.createTransport({
            host: host,
            port: port,
            auth: {
                user: user,
                pass: password
            }
        });
        this.from = from;
    }
    async sendEmail(to, subject, body) {
        const mailOptions = {
            from: this.from,
            to: to,
            subject: subject,
            text: body,
        };
        try {
            await new Promise((resolve, reject) => {
                this.transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error)
                    } else {
                        console.log('Correo electrónico enviado con éxito:', info.response);
                        resolve(true)
                    }
                })
            });
            return true;
        } catch (error) {
            return error
        }
    }
}
module.exports = emailService;