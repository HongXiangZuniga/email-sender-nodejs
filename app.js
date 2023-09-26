require("dotenv").config();
const redis = require('redis');
const emailService = require("./src/mail/service.js");
const redisRepo = require("./src/persistence/redis/repository.js");

async function main() {
  /*Init redisClient*/

  const url = "redis://"+process.env.REDIS_USER+":"+process.env.REDIS_PASSWORD+"@"+process.env.REDIS_HOST+":"+process.env.REDIS_PORT

  const clientRedis = await redis.createClient({
    url: url,
  });
  clientRedis.on("error", (err) => console.log("Redis Client Error", err));
  clientRedis.connect();
  const redisRepoInstance = new redisRepo(clientRedis);

  /*Create Email Service*/
  const emailServiceInstance = new emailService(
    process.env.SMTP_USER,
    process.env.SMTP_PASSWORD,
    process.env.SMTP_HOST,
    process.env.MAIL_FROM,
    587
  );

  /*Create Subscriber Service*/
  const subscriberService = require("./src/subscriber/service.js");
  const subscriberServiceInstance = new subscriberService(
    emailServiceInstance,
    redisRepoInstance,
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_REGION,
    process.env.SQS_QUEUE_URL
  );
  try {
    await subscriberServiceInstance.listen();
  } catch (error) {
    console.error(error);
  }
}

main();
