import { Router } from 'express';
import jwtAuth from '../middlewares/auth';

import {
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey
} from '../controllers/survey.controller';

const router = Router();

router.get('/surveys', jwtAuth, getSurveys);
router.get('/surveys/:id', jwtAuth, getSurvey);
router.post('/surveys', createSurvey);
router.put('/surveys/:id', updateSurvey);
router.delete('/surveys/:id', deleteSurvey);

export default router;
