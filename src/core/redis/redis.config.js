const { REDIS_HOST: host, REDIS_PORT: port } = process.env;

const redisConfig = {
  host,
  port,
};

module.exports = redisConfig;
