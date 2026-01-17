import { ZodError } from 'zod';

// eslint-disable-next-line no-console
console.log('ZodError prototype:', ZodError.prototype);
const err = new ZodError([]);
// eslint-disable-next-line no-console
console.log('ZodError instance keys:', Object.keys(err));
