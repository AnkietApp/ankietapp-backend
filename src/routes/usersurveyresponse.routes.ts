import { Router } from 'express';
import { updateSurveyResponse } from '../controllers/usersurveyresponse.controller';
import jwtAuth from '../middlewares/auth';

const router = Router();

//router.get('/user-surv', getUsers);
//router.get('/users/:id', getUser);
router.put('/user-survey-response/:id', jwtAuth, updateSurveyResponse);
//router.put('/users/:id', updateUser);
//router.delete('/users/:id', deleteUser);

export default router;
