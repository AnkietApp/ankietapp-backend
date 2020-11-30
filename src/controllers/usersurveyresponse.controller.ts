/* eslint-disable import/prefer-default-export */
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import UserSurveyResponse from '../entity/UserSurveyResponse';
import Answer from '../entity/Answer';

export const updateSurveyResponse = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const user = (<any>req).user;
    try {
        const userResponse = await getRepository(UserSurveyResponse)
      .createQueryBuilder('userSurveyResponse')
      .select()
      .where('userSurveyResponse.id = :userResponseId')
      .andWhere('userSurveyResponse.userId = :userId')
      .andWhere('userSurveyResponse.completed = :completed')
      .setParameters({
        userResponseId: req.params.id,
        userId: user.id,
        completed: false
      })
      .getOne();
        getRepository(UserSurveyResponse).update(userResponse!.id, {...userResponse!, completed: true});
        const updatedResponse = await getRepository(UserSurveyResponse).findOne({ where: {id: req.params.id, userId: user.id, completed: true}});
        console.log(updatedResponse);

        req.body.answers.forEach(async (answer: Answer) => {
            const newAnswer: Answer = getRepository(Answer).create({ ...answer, userSurveyResponseId: updatedResponse!.id });
            await getRepository(Answer).save(newAnswer);
        });
        return res.json(updatedResponse);
        
    }
    catch (err) {
        return res.send(err);
    }
};