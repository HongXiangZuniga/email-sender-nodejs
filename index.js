require('dotenv').config();

const emailService = require("./src/mail/service.js");
const emailServiceInstance  = new emailService(process.env.SMTP_USER,process.env.SMTP_PASSWORD,process.env.SMTP_HOST,process.env.MAIL_FROM,587);
const subscriberService = require("./src/subscriber/service.js");
const subscriberServiceInstance = new subscriberService(emailServiceInstance,process.env.AWS_ACCESS_KEY_ID,process.env.AWS_SECRET_ACCESS_KEY,process.env.AWS_REGION,process.env.SQS_QUEUE_URL);


async function  main(){
try{
    await subscriberServiceInstance.listen();
}catch(error){
    console.error(error)
}}

main()