import { Router } from 'express';
import { createSurveyResponse } from '../controllers/usersurveyresponse.controller';

const router = Router();

//router.get('/user-surv', getUsers);
//router.get('/users/:id', getUser);
router.post('/user-survey-response', createSurveyResponse);
//router.put('/users/:id', updateUser);
//router.delete('/users/:id', deleteUser);

export default router;
