const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

const disconnectMongoDB = async () => {
  try {
    const admin = mongoClient.db().admin();
    const operations = await admin.serverStatus();
    const activeOps = operations.globalLock.activeClients.total;

    if (activeOps > 0) {
      console.log(
        `⏳ Waiting for ${activeOps} active MongoDB operations to finish...`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
      return await disconnectMongoDB(); // Retry after waiting
    }

    await mongoClient.close();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting MongoDB:", error);
  }
};

const runLongMongoQuery = async () => {
  console.log("⏳ Running a long MongoDB operation...");
  await new Promise((resolve) => setTimeout(resolve, 10000)); // 10-second delay
  console.log("✅ Long MongoDB operation finished.");
};

const isMongoConnected = async () => {
  try {
    const databases = await mongoClient.db().admin().listDatabases();
    return databases.databases.length > 0; // Returns true if query succeeds
  } catch (error) {
    console.error("❌ MongoDB readiness check failed:", error);
    return false;
  }
};

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  isMongoConnected,
  runLongMongoQuery,
};
