import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';

import UserSurveyResponse from '../entity/UserSurveyResponse';
import Answer from '../entity/Answer';
import Choice from '../entity/Choice';

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
            answer.userSurveyResponseId = savedSurvey.id;
            const newAnswer: Answer = await getRepository(Answer).create(answer);
            const savedAsnwer: Answer = await getRepository(Answer).save(newAnswer);
        });
        return res.json(savedSurvey);
    }
    catch (err) {
        return res.send(err);
    }
};