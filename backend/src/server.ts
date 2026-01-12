import app from './app.js';
import { validateEnv } from './config/env-validator.js';
import { checkFirestoreConnection } from './config/firestore-status.js';

const PORT = Number(process.env.PORT ?? 3000);

async function startServer() {
  validateEnv();

  console.log('Initializing services...');
  const isConnected = await checkFirestoreConnection();

  if (!isConnected) {
    throw new Error('Firestore connection failure.');
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exitCode = 0;
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });
}

void startServer().catch((error) => {
  console.error('Startup failure:', error);
  process.exitCode = 1;
});
