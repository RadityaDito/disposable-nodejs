const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};

const disconnectRedis = async () => {
  try {
    await redisClient.quit();
    console.log("✅ Disconnected from Redis");
  } catch (error) {
    console.error("❌ Error disconnecting Redis:", error);
  }
};

// Function to check Redis connection status
const isRedisConnected = () => {
  return redisClient.isOpen; // Returns true if Redis is connected
};

module.exports = { connectRedis, disconnectRedis, isRedisConnected };
