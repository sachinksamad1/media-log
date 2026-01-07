import { ZodError, z } from "zod";

try {
  const schema = z.string();
  schema.parse(123);
} catch (err) {
  if (err instanceof ZodError) {
    console.log("Keys on ZodError instance:", Object.keys(err));
    // @ts-ignore
    console.log("err.errors:", err.errors);
    // @ts-ignore
    console.log("err.issues:", err.issues);
  }
}
