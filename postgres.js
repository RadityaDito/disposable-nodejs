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
    const res = await client.query("SELECT 1"); // Simple query to check connection
    return res ? true : false;
  } catch (error) {
    return false;
  }
};

module.exports = { connectPostgres, disconnectPostgres, isPostgresConnected };
