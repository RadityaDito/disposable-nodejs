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
    const res = await client.query(`
      SELECT count(*) AS active_queries 
      FROM pg_stat_activity 
      WHERE state != 'idle' AND query NOT ILIKE '%pg_stat_activity%';
    `);

    if (parseInt(res.rows[0].active_queries) > 0) {
      console.log(
        `⏳ Waiting for ${res.rows[0].active_queries} active queries to finish...`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
      return await disconnectPostgres(); // Retry after waiting
    }

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
