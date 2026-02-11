import type { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';

import { ResponseUtil } from '@/common/utils/api-response.js';
import { catchAsync } from '@/common/utils/catch-async.js';
import { auth } from '@/config/firebase.js';

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return ResponseUtil.error(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return ResponseUtil.error(res, 401, 'Unauthorized: No token provided');
    }

    try {
      // 2. Verify token with Firebase Admin
      let decodedToken: DecodedIdToken;

      if (process.env.NODE_ENV === 'test' && token === 'test-token-123') {
        decodedToken = {
          uid: 'test-user-id',
          email: 'test@example.com',
          email_verified: true,
        } as unknown as DecodedIdToken;
      } else {
        decodedToken = await auth.verifyIdToken(token);
      }

      // 3. Attach UID to the request object for use in Controllers
      req.user = decodedToken;
      next();
    } catch {
      return ResponseUtil.error(
        res,
        401,
        'Unauthorized: Invalid or expired token',
      );
    }
  },
);
