import type { Request, Response, NextFunction } from 'express';

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
      const decodedToken = await auth.verifyIdToken(token);

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
