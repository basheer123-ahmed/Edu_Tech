const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('✅ Redis Connected successfully'));

/**
 * Cache Wrapper
 * @param {string} key 
 * @param {Function} cb 
 * @param {number} ttl - Time to live in seconds
 */
const getOrSetCache = async (key, cb, ttl = 3600) => {
  try {
    const data = await redis.get(key);
    if (data) return JSON.parse(data);

    const freshData = await cb();
    await redis.setex(key, ttl, JSON.stringify(freshData));
    return freshData;
  } catch (error) {
    console.error('Redis Error:', error);
    return cb(); // Fallback to DB if Redis fails
  }
};

module.exports = {
  redis,
  getOrSetCache,
};
