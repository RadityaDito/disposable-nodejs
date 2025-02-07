const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

const connectPostgres = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    throw error;
  }
};

const disconnectPostgres = async () => {
  try {
    await client.end();
    console.log("✅ Disconnected from PostgreSQL");
  } catch (error) {
    console.error("❌ Error disconnecting PostgreSQL:", error);
  }
};

// Function to check PostgreSQL connection status
const isPostgresConnected = async () => {
  try {
    const res = await client.query("SELECT 1"); // Lightweight query
    return res.rowCount > 0; // Returns true if query succeeds
  } catch (error) {
    console.error("❌ PostgreSQL readiness check failed:", error);
    return false;
  }
};

const runLongQuery = async () => {
  console.log("⏳ Running a long PostgreSQL query...");
  await client.query("SELECT pg_sleep(10);"); // 10-second delay
  console.log("✅ Long query finished.");
};

module.exports = {
  connectPostgres,
  disconnectPostgres,
  isPostgresConnected,
  runLongQuery,
};
