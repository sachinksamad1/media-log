import { Router } from "express";
import animeRoutes from "./modules/anime/anime-routes.js";
import fictionRoutes from "./modules/fiction/fiction-routes.js";
import gamesRoutes from "./modules/games/games-routes.js";

const router = Router();

// Anime Routes
router.use("/anime", animeRoutes);
// Fiction Routes
router.use("/fiction", fictionRoutes);
// Games Routes
router.use("/games", gamesRoutes);

export default router;
