async function verifySwagger() {
  try {
    // eslint-disable-next-line no-console
    console.log('Verifying Swagger endpoint...');
    const response = await fetch('http://localhost:3000/api-docs/');

    if (response.status === 200) {
      // eslint-disable-next-line no-console
      console.log(
        '✅ Swagger UI is reachable at http://localhost:3000/api-docs/',
      );
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `❌ Swagger UI endpoint returned status: ${response.status}`,
      );
      process.exitCode = 1;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      '❌ Could not connect to the server. Make sure "pnpm dev" is running.',
    );
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  }
}

void verifySwagger();
