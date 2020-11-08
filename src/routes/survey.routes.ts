import { Router } from 'express';
import {
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey
} from '../controllers/survey.controller';

const router = Router();

router.get('/surveys', getSurveys);
router.get('/surveys/:id', getSurvey);
router.post('/surveys', createSurvey);
router.put('/surveys/:id', updateSurvey);
router.delete('/surveys/:id', deleteSurvey);

export default router;
