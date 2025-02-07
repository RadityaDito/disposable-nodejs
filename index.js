require("dotenv").config();
const express = require("express");
const {
  connectPostgres,
  disconnectPostgres,
  isPostgresConnected,
  runLongQuery,
} = require("./postgres");
const { connectRedis, disconnectRedis, isRedisConnected } = require("./redis");
const { connectKafka, disconnectKafka, isKafkaConnected } = require("./kafka");
const {
  connectMongoDB,
  disconnectMongoDB,
  isMongoConnected,
  runLongMongoQuery,
} = require("./mongodb");

const app = express();
const PORT = process.env.PORT || 8080;

let isAppReady = false;

// Function to initialize all connections
const initializeConnections = async () => {
  try {
    await connectPostgres();
    await connectRedis();
    await connectKafka();
    await connectMongoDB();

    isAppReady = true;
    console.log("✅ Startup completed. Application is ready.");
  } catch (error) {
    console.error(
      "❌ Startup failed due to database/queue connection issues:",
      error
    );
    process.exit(1);
  }
};

// Liveness Probe
app.get("/liveness", (req, res) => {
  res.status(200).send("Liveness: OK");
});

// Readiness Probe
app.get("/readiness", async (req, res) => {
  if (!isAppReady) {
    return res
      .status(503)
      .json({ message: "Readiness: NOT READY (Application not ready)" });
  }

  try {
    const postgresReady = await isPostgresConnected();
    const redisReady = await isRedisConnected();
    const kafkaReady = await isKafkaConnected();
    const mongoReady = await isMongoConnected();

    if (postgresReady && redisReady && kafkaReady && mongoReady) {
      res.status(200).send("Readiness: OK");
    } else {
      res.status(503).json({
        message: "Readiness: NOT READY",
        postgres: postgresReady ? "OK" : "DOWN",
        redis: redisReady ? "OK" : "DOWN",
        kafka: kafkaReady ? "OK" : "DOWN",
        mongodb: mongoReady ? "OK" : "DOWN",
      });
    }
  } catch (error) {
    res.status(503).json({
      message: "Readiness: NOT READY",
      error: error.message,
    });
  }
});

// Startup Probe
app.get("/startup", (req, res) => {
  if (isAppReady) {
    res.status(200).send("Startup: OK");
  } else {
    res.status(503).send("Startup: STILL STARTING");
  }
});

app.get("/test-postgres", async (req, res) => {
  await runLongQuery();
  res.send("✅ Long PostgreSQL query completed.");
});

app.get("/test-mongo", async (req, res) => {
  await runLongMongoQuery();
  res.send("✅ Long MongoDB operation completed.");
});

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initializeConnections();
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log("\n🔻 Graceful shutdown in progress...");

  isAppReady = false; // Mark application as not ready before shutting down

  server.close(async () => {
    console.log("✅ Server shut down gracefully.");

    await disconnectKafka(); // Wait for Kafka messages to be processed
    await disconnectRedis(); // Ensure Redis has no pending commands
    await disconnectMongoDB(); // Ensure MongoDB has no active queries
    await disconnectPostgres(); // Ensure PostgreSQL has no active transactions

    process.exit(0);
  });
};

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
