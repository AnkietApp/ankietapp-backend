import { Router } from 'express';
import jwtAuth from '../middlewares/auth';

import {
    getReport
  } from '../controllers/report.controller';

const router = Router();

router.get('/reports/:id',  getReport);

export default router;