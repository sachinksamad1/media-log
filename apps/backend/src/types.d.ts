import type { DecodedIdToken } from 'firebase-admin/auth';

import type { UploadedFile } from '@/common/types/file-types.js';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      file?: UploadedFile;
    }
  }
}
