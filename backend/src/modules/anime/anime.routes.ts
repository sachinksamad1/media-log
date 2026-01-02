import { Router } from 'express';
import { AnimeController } from './anime.controller.js';
import { AnimeService } from './anime.service.js';
import { AnimeRepository } from './anime.repo.js';
import { validate } from '../../common/middlewares/validate-request.js';
import { AnimeSchema } from './anime.schema.js';

const router = Router();
const animeRepo = new AnimeRepository();
const animeService = new AnimeService(animeRepo);
const animeController = new AnimeController(animeService);

router.post("/", validate(AnimeSchema), animeController.create);
router.get("/", animeController.getAll);
router.get("/:id", animeController.getOne);

export default router;