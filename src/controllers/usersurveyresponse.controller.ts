/* eslint-disable import/prefer-default-export */
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import UserSurveyResponse from '../entity/UserSurveyResponse';
import Answer from '../entity/Answer';

export const createSurveyResponse = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const responseFromReq = {
        userId: req.body.user_id,
        surveyId: req.body.survey_id,
        completed: true
    };
    try {
        const newResponse: UserSurveyResponse = getRepository(UserSurveyResponse).create(responseFromReq);
        const savedSurvey: UserSurveyResponse = await getRepository(UserSurveyResponse).save(newResponse);
        req.body.answers.forEach(async (answer: Answer) => {
            const newAnswer: Answer = getRepository(Answer).create({ ...answer, userSurveyResponseId: savedSurvey.id });
            await getRepository(Answer).save(newAnswer);
        });
        return res.json(savedSurvey);
    }
    catch (err) {
        return res.send(err);
    }
};