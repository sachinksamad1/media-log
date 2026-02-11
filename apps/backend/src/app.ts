import { globalErrorHandler } from '@common/errors/error-handler.js';
import corsOptions from '@config/cors.js';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './app.routes.js';

const app = express();

// 1. Security Headers (Place very first)
app.use(helmet());

// 2. Rate Limiting (Prevent DDoS/Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 10000 : 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 3. Logging & Monitoring
app.use(morgan('dev'));

// 4. Parsing & CORS
app.use(cors(corsOptions));
// Skip JSON parsing for multipart requests - these are handled by fileUploadMiddleware
app.use(
  express.json({
    limit: '10kb',
    type: (req) => {
      const contentType = req.headers['content-type'] || '';
      // Skip JSON parsing for multipart/form-data requests
      return !contentType.includes('multipart/form-data');
    },
  }),
);

// 5. Routes & Error Handling
app.use('/check', (req, res) => res.status(200).json({ status: 'OK' }));
app.use('/api', routes);
app.use(globalErrorHandler);

export default app;
