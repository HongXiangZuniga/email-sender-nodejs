const AWS = require("aws-sdk");
const subscriberServiceInterface = {
  listen: async function () {},
  searchMessage: async function () {},
};

subscriberServiceInterface.mailService;
subscriberServiceInterface.awsConfig;
subscriberServiceInterface.sqs;
subscriberServiceInterface.queueURL;
subscriberServiceInterface.params;
subscriberServiceInterface.redisRepo;

class subscriberService {
  constructor(
    mailService,
    redisRepo,
    accessKeyId,
    secretAccessKey,
    region,
    queueURL
  ) {
    this.mailService = mailService;
    this.redisRepo = redisRepo;
    this.awsConfig = AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    });
    this.sqs = new AWS.SQS();
    this.queueURL = queueURL;
    this.params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: this.queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0,
    };
  }
  async listen() {
    while (true) {
      await delay(5000);
      console.debug("Search message");
      try {
        await this.searchMessage();
      } catch (error) {
        console.error(error);
      }
    }
  }
  async searchMessage() {
    try {
      const data2 = await new Promise((resolve, reject) => {
        this.sqs.receiveMessage(this.params, (err, data) => {
          if (err) {
            reject("error al recibir el mensaje:" + err.message);
          } else {
            resolve(data);
          }
        });
      });
      if (data2.Messages) {
        try {
          const jsonObject = JSON.parse(data2.Messages[0].Body);
          const subject = jsonObject.subject;
          let to = jsonObject.to;
          const key = jsonObject.key;
          await new Promise(async (resolve, reject) => {
            try {
              if (subject == undefined) {
                throw new Error("subject not found");
              }
              if (to == undefined) {
                throw new Error("to not found");
              }
              if (key == undefined) {
                throw new Error("key not found");
              }
              const body = await this.redisRepo.getValue(key);
              const result = await this.mailService.sendEmail(
                to,
                subject,
                body
              );
              if (result == true) {
                resolve(result);
              } else {
                reject(result);
              }
            } catch (error) {
              reject(error);
            }
          });
          let deleteParams = {
            QueueUrl: this.queueURL,
            ReceiptHandle: data2.Messages[0].ReceiptHandle,
          };

          await new Promise((resolve, reject) => {
            this.sqs.deleteMessage(deleteParams, (err, data) => {
              if (err) {
                reject("error al borrar el mensaje:" + err.message);
              } else {
                console.log("Message Deleted", data);
                resolve(1);
              }
            });
          });
        } catch (error) {
          throw  error;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = subscriberService;
