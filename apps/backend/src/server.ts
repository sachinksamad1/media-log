import { validateEnv } from '@config/env-validator.js';
import { checkFirestoreConnection } from '@config/firestore-status.js';

import app from './app.js';

const PORT = Number(process.env.PORT ?? 3000);

async function startServer() {
  validateEnv();

  // eslint-disable-next-line no-console
  console.log('Initializing services...');
  const isConnected = await checkFirestoreConnection();

  if (!isConnected) {
    throw new Error('Firestore connection failure.');
  }

  const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${PORT}`);
  });

  const shutdown = (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`Received ${signal}. Shutting down...`);
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('HTTP server closed.');
      process.exitCode = 0;
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });
}

void startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Startup failure:', error);
  process.exitCode = 1;
});
