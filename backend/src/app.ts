import { globalErrorHandler } from '@common/errors/error-handler.js';
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
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. Logging & Monitoring
app.use(morgan('dev'));

// 4. Parsing & CORS
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body limit prevents large payload attacks

// 5. Routes & Error Handling
app.use('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.use('/api/v1', routes);
app.use(globalErrorHandler);

export default app;
