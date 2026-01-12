import type { Request, Response } from 'express';

import { checkHealth } from './health-service.js';

export async function getHealth(req: Request, res: Response) {
  try {
    const deps = await checkHealth();

    res.status(200).json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      dependencies: deps,
    });
  } catch {
    res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      dependencies: {
        firestore: 'down',
      },
    });
  }
}
