// src/dashboard/dashboard.routes.ts
import { Router } from 'express';

import { repositories } from '../../repositories.js'; // wherever you build your MediaRepository map

import { DashboardController } from './dashboard-controller.js';
import { DashboardService } from './dashboard-service.js';

const router = Router();

const dashboardService = new DashboardService(repositories);
const dashboardController = new DashboardController(dashboardService);

router.get('/library-summary', dashboardController.getLibrarySummary);

export default router;
