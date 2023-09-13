const AWS = require('aws-sdk');
const subscriberServiceInterface = {
    listen: async function () { },
    searchMessage: async function () { },
};

subscriberServiceInterface.mailService;
subscriberServiceInterface.awsConfig;
subscriberServiceInterface.sqs;
subscriberServiceInterface.queueURL;
subscriberServiceInterface.params;

class subscriberService {
    constructor(mailService, accessKeyId, secretAccessKey, region, queueURL) {
        this.mailService = mailService;
        this.awsConfig = AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        });
        this.sqs =  new AWS.SQS();
        this.queueURL = queueURL;
        this.params = {
            AttributeNames: ["SentTimestamp"],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: ["All"],
            QueueUrl: this.queueURL,
            VisibilityTimeout: 20,
        };
    }
    async listen() {
        while (true) {
            await delay(5000);
            console.debug("Search message")
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
                    const to = jsonObject.to;
                    const body = jsonObject.body;
                    await new Promise(async (resolve, reject) => {
                        if (subject == undefined) {
                            reject("email not found");
                        }
                        if (to == undefined) {
                            reject("to not found");
                        }
                        if (body == undefined) {
                            reject("body not found")
                        }
                        const result = await this.mailService.sendEmail(to, subject, body);
                        if (result == true) {
                            resolve(result)
                        } else {
                            reject(result)
                        }
                    });
                    let deleteParams = {
                        QueueUrl: this.queueURL,
                        ReceiptHandle: data2.Messages[0].ReceiptHandle
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
                    throw new Error(error);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

module.exports = subscriberService;
