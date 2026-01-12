import { ZodError } from 'zod';

console.log('ZodError prototype:', ZodError.prototype);
const err = new ZodError([]);
console.log('ZodError instance keys:', Object.keys(err));
