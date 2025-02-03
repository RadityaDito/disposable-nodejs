# Disposable Node.js

A Node.js application using PostgreSQL, Redis, Kafka, and MongoDB, designed to run both inside Docker and locally. This project demonstrates the principle of disposability, one of the 12-factor app principles, ensuring fast startup and graceful shutdown for easy scaling and fault tolerance.

---

## 📌 Features

- **PostgreSQL** for database storage
- **Redis** for caching
- **Kafka** for event streaming
- **MongoDB** for NoSQL data storage
- **Docker Support** for easy deployment
- **Health Check Endpoints** (Liveness, Readiness, Startup)

---

## 🛠️ Setup Instructions

### 🔹 1. Clone Repository

```sh
  git clone https://github.com/RadityaDito/disposable-nodejs.git
  cd disposable-nodejs
```

### 🔹 2. Configure Environment Variables

Rename `.env.example` to `.env` and update values if needed:

```sh
cp .env.example .env
```

### 🔹 3. Running Locally

#### ✅ Start Dependencies (Postgres, Redis, Kafka, MongoDB)

```sh
  docker-compose up -d postgres redis kafka mongodb zookeeper
```

#### ✅ Install Dependencies

```sh
  npm install
```

#### ✅ Run the Node.js Application

```sh
  npm start
```

Your app will be available at: **http://localhost:8080**

---

### 🔹 4. Running with Docker

#### ✅ Start the Whole Stack

```sh
  docker-compose up -d
```

#### ✅ Check Running Containers

```sh
  docker ps
```

#### ✅ View Logs

```sh
  docker logs -f disposable-nodejs
```

Your app will be available at: **http://localhost:8080**

---

## 🔍 Health Check Endpoints

| Endpoint     | Description                     |
| ------------ | ------------------------------- |
| `/liveness`  | Check if the server is running  |
| `/readiness` | Check if dependencies are ready |
| `/startup`   | Check if the app has started    |

---

## 📝 Technologies Used

- **Node.js & Express**
- **PostgreSQL** (Relational Database)
- **Redis** (Cache)
- **Kafka** (Message Broker)
- **MongoDB** (NoSQL Database)
- **Docker & Docker Compose**

---

## 🎯 Troubleshooting

### ❌ Kafka Error: `ECONNREFUSED 127.0.0.1:9092`

✔ **Fix**: Ensure your `.env` is correctly set:

```sh
KAFKA_BROKER=localhost:29092  # For local
KAFKA_BROKER=kafka:9092  # For Docker
```

### ❌ PostgreSQL or Redis Connection Issue

✔ **Fix**: Restart services

```sh
  docker-compose down && docker-compose up -d
```

### ❌ MongoDB Authentication Error

✔ **Fix**: Ensure MongoDB is running

```sh
  docker ps | grep mongo
```

---
