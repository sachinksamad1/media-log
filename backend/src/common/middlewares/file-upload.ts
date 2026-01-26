import fs from 'fs';
import os from 'os';
import path from 'path';

import busboy from 'busboy';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Extend Request to include Firebase's rawBody
interface FirebaseRequest extends Request {
  rawBody?: Buffer;
}

export const fileUploadMiddleware = (
  req: FirebaseRequest,
  res: Response,
  next: NextFunction,
) => {
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return next();
  }

  const bb = busboy({
    headers: req.headers,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  const fields: Record<string, unknown> = {};
  const fileWrites: Promise<void>[] = [];
  let fileInfo:
    | {
        filepath: string;
        originalFilename: string;
        mimetype: string;
        size: number;
      }
    | undefined;

  bb.on('file', (_name, file, info) => {
    const { filename, mimeType } = info;
    const tempName = `upload_${uuidv4()}_${filename}`;
    const saveTo = path.join(os.tmpdir(), tempName);
    const writeStream = fs.createWriteStream(saveTo);

    const writePromise = new Promise<void>((resolve, reject) => {
      file.pipe(writeStream);

      file.on('limit', () => {
        // Delete the partial file
        fs.unlink(saveTo, () => {});
        reject(new Error('File too large. Max limit is 5MB.'));
      });

      writeStream.on('finish', () => {
        if (!fileInfo) {
          fileInfo = {
            filepath: saveTo,
            originalFilename: filename,
            mimetype: mimeType,
            size: writeStream.bytesWritten,
          };
        }
        resolve();
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    });

    fileWrites.push(writePromise);
  });

  bb.on('field', (name, val) => {
    fields[name] = val;
  });

  bb.on('close', () => {
    Promise.all(fileWrites)
      .then(() => {
        req.body = fields;

        // Handle 'data' field manually if it exists (for JSON payload in multipart)
        if (typeof req.body.data === 'string') {
          try {
            const parsed = JSON.parse(req.body.data);
            req.body = { ...req.body, ...parsed };
          } catch {
            // ignore parsing error, let validation handle it
          }
        }

        if (fileInfo) {
          req.file = fileInfo;
        }

        next();
      })
      .catch((err) => {
        const error = err as Error;
        return res.status(400).json({
          success: false,
          message: `File upload error: ${error.message}`,
          data: null,
        });
      });
  });

  bb.on('error', (err: unknown) => {
    const error = err as Error;
    if (!res.headersSent) {
      res.status(400).json({
        success: false,
        message: `File upload error: ${error.message}`,
        data: null,
      });
    }
  });

  // In Firebase Functions, the body is already consumed and stored in req.rawBody
  // We need to feed the rawBody to busboy instead of piping the request
  if (req.rawBody) {
    bb.end(req.rawBody);
  } else {
    req.pipe(bb);
  }
};
