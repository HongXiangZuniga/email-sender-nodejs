require('dotenv').config();

const emailService = require("./src/mail/service.js");
const emailServiceInstance  = new emailService(process.env.SMTP_USER,process.env.SMTP_PASSWORD,process.env.SMTP_HOST,process.env.MAIL_FROM,587);
const redisRepo = require("./src/persistence/redis/repository.js");
const redisRepoInstance = new redisRepo(process.env.REDIS_HOST,process.env.REDIS_PASSWORD,6379)
const subscriberService = require("./src/subscriber/service.js");
const subscriberServiceInstance = new subscriberService(emailServiceInstance,redisRepoInstance,process.env.AWS_ACCESS_KEY_ID,process.env.AWS_SECRET_ACCESS_KEY,process.env.AWS_REGION,process.env.SQS_QUEUE_URL);


async function  main(){
try{
    await subscriberServiceInstance.listen();
}catch(error){
    console.error(error)
}}

main()