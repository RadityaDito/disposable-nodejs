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
    await mongoClient.close();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting MongoDB:", error);
  }
};

const isMongoConnected = () => {
  return mongoClient.topology && mongoClient.topology.isConnected();
};

module.exports = { connectMongoDB, disconnectMongoDB, isMongoConnected };
