import { ZodError, z } from 'zod';

try {
  const schema = z.string();
  schema.parse(123);
} catch (err) {
  if (err instanceof ZodError) {
    // eslint-disable-next-line no-console
    console.log('Keys on ZodError instance:', Object.keys(err));

    // eslint-disable-next-line no-console
    console.log('err.issues:', err.issues);
  }
}
