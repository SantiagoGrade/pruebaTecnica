import { Router } from 'express';
import { getCaracol } from '../controllers/spiralController';

const router = Router();

// GET /api/caracol/:n
router.get('/caracol/:n', getCaracol);

export default router;