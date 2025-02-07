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
    if (!redisClient.isOpen) {
      console.log("✅ Redis already disconnected");
      return;
    }

    console.log("⏳ Flushing Redis commands before disconnecting...");
    await redisClient.flushAll(); // Ensure all commands are processed

    await redisClient.quit();
    console.log("✅ Disconnected from Redis");
  } catch (error) {
    console.error("❌ Error disconnecting Redis:", error);
  }
};

// Function to check Redis connection status
const isRedisConnected = async () => {
  try {
    const pong = await redisClient.ping(); // Redis responds with "PONG"
    return pong === "PONG";
  } catch (error) {
    console.error("❌ Redis readiness check failed:", error);
    return false;
  }
};

module.exports = {
  connectRedis,
  disconnectRedis,
  isRedisConnected,
};
