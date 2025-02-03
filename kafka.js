const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log("✅ Connected to Kafka");
  } catch (error) {
    console.error("Kafka connection error:", error);
  }
};

const disconnectKafka = async () => {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log("Disconnected from Kafka");
  } catch (error) {
    console.error("Error disconnecting Kafka:", error);
  }
};

const isKafkaConnected = async () => {
  try {
    const clusterInfo = await kafka.admin().describeCluster();
    return !!clusterInfo.brokers.length;
  } catch (error) {
    console.error("Kafka connection error:", error);
    return false;
  }
};

module.exports = { connectKafka, disconnectKafka, isKafkaConnected };
