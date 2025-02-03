require("dotenv").config();
const express = require("express");
const {
  connectPostgres,
  disconnectPostgres,
  isPostgresConnected,
} = require("./postgres");
const { connectRedis, disconnectRedis, isRedisConnected } = require("./redis");
const { connectKafka, disconnectKafka, isKafkaConnected } = require("./kafka");

const app = express();
const PORT = process.env.PORT || 8080;

let isAppReady = false;

// Function to initialize all connections
const initializeConnections = async () => {
  try {
    await connectPostgres();
    await connectRedis();
    await connectKafka();

    // Set app as ready after successful connections
    isAppReady = true;
    console.log("Startup completed. Application is ready.");
  } catch (error) {
    console.error(
      "Startup failed due to database/queue connection issues:",
      error
    );
    process.exit(1); // Exit the app with failure code
  }
};

// Liveness Probe: Check if the server is running
app.get("/liveness", (req, res) => {
  res.status(200).send("Liveness: OK");
});

// Readiness Probe: Check if all services are connected
app.get("/readiness", async (req, res) => {
  try {
    const postgresReady = await isPostgresConnected();
    const redisReady = await isRedisConnected();
    const kafkaReady = await isKafkaConnected();

    if (postgresReady && redisReady && kafkaReady) {
      res.status(200).send("Readiness: OK");
    } else {
      res.status(503).json({
        message: "Readiness: NOT READY",
        postgres: postgresReady ? "OK" : "DOWN",
        redis: redisReady ? "OK" : "DOWN",
        kafka: kafkaReady ? "OK" : "DOWN",
      });
    }
  } catch (error) {
    res.status(503).json({
      message: "Readiness: NOT READY",
      error: error.message,
    });
  }
});

// Startup Probe: Check if the application has fully started
app.get("/startup", (req, res) => {
  if (isAppReady) {
    res.status(200).send("Startup: OK");
  } else {
    res.status(503).send("Startup: STILL STARTING");
  }
});

// Start the server only if connections succeed
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeConnections();
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log("\nGraceful shutdown in progress...");
  await disconnectPostgres();
  await disconnectRedis();
  await disconnectKafka();

  server.close(() => {
    console.log("Server shut down gracefully.");
    process.exit(0);
  });
};

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
