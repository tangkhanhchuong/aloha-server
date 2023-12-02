const Redis = require('ioredis');
const redisConfig = require('../configs/redis.config');

const redis = new Redis(redisConfig);

module.exports = { redis };
