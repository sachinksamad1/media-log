import app from "./app.js";
import "./config/env.js";
import { checkFirestoreConnection } from "./config/firestore-status.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  console.log("Checking Firestore connection...");

  const isConnected = await checkFirestoreConnection();

  if (!isConnected) {
    console.error("Server startup aborted due to Firestore connection failure.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
