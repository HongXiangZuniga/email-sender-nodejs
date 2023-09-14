const Redis = require("ioredis");
const redisRepositoryInterface = {
    getHTML: async function (key) { value },
};
redisRepositoryInterface.RedisClient;


class redisRepo {
    constructor(host,password,port) {
        this.RedisClient = new Redis({
            host: host,
            port: port, 
            username: "default", 
            password: password,
            db:0,
        });

    }

    async getHTML(key) {
        try {
            await new Promise((resolve, reject) => {
                value = this.RedisClient.get(key, (error, value) => {
                    if (error) {
                        reject(error)
                    } else {
                       resolve(value)
                    }
                })
                return value;
            });;
        } catch (error) {
            throw new Error("key "+key+" error: "+error);
        }
    }
}
module.exports=redisRepo;