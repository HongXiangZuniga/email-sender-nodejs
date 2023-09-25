const redisRepositoryInterface = {
  getValue: async function (key) {
    value;
  },
};
redisRepositoryInterface.RedisClient;

class redisRepo {
  constructor(client) {
    this.RedisClient = client;
  }

  async getValue(key) {
    try {
      const result = await this.RedisClient.get(key);
      if (result == null) {
        throw new Error("empty body");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = redisRepo;
