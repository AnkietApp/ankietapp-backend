import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import sendEmail from '../utils/mailgun';

import Survey from '../entity/Survey';
import Question from '../entity/Question';
import Choice from '../entity/Choice';
import User from '../entity/User';

import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION
} from '../utils/constants';
import UserSurveyResponse from '../entity/UserSurveyResponse';

export const getSurveys = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const surveys = await getRepository(Survey).find();
    return res.json(surveys);
  } catch (err) {
    return res.send(err);
  }
};

export const getSurvey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = (<any>req).user;
  try {
    const userSurveyResponse = await getRepository(UserSurveyResponse)
      .createQueryBuilder('userSurveyResponse')
      .select(['userSurveyResponse.id'])
      .where('userSurveyResponse.surveyId = :surveyId')
      .andWhere('userSurveyResponse.userId = :userId')
      .setParameters({ surveyId: req.params.id, userId: user.id })
      .getOne();

    const survey = await getRepository(Survey).findOne(req.params.id, {
      relations: ['questions', 'questions.choices']
    });
    return res.json({
      userSurveyResponseId: userSurveyResponse!.id,
      survey: survey
    });
  } catch (err) {
    return res.send(err);
  }
};

export const createSurvey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const surveyFromReq = {
    name: req.body.name,
    description: req.body.description,
    dueDate: req.body.dueDate,
    public: req.body.public
  };

  try {
    const newSurvey: Survey = await getRepository(Survey).create(surveyFromReq);
    const savedSurvey: Survey = await getRepository(Survey).save(newSurvey);
    req.body.questions.forEach(async (question: Question) => {
      const newQuestion: Question = await getRepository(Question).create({
        ...question,
        survey: savedSurvey
      });
      const savedQuestion: Question = await getRepository(Question).save(
        newQuestion
      );
      if (
        question.choices &&
        (savedQuestion.type === MULTIPLE_CHOICE_QUESTION ||
          savedQuestion.type === SINGLE_CHOICE_QUESTION)
      ) {
        question.choices.forEach(async (choiceValue: Choice) => {
          const newChoice: Choice = await getRepository(Choice).create({
            value: String(choiceValue),
            question: savedQuestion
          });
          const savedChoice: Choice = await getRepository(Choice).save(
            newChoice
          );
        });
      }
    });

    let users: User[];

    // TODO Refactor into one block of code
    if (savedSurvey.public) {
      users = await getRepository(User)
        .createQueryBuilder('user')
        .select(['user.id', 'user.email'])
        .getMany();
    } else {
      users = await getRepository(User)
        .createQueryBuilder('user')
        .select(['user.id', 'user.email'])
        .where('user.email IN (:...emails)', {
          emails: req.body.users
        })
        .getMany();
    }

    // TODO Refactor into bulk insert
    users.forEach(async (user: User) => {
      const newUserSurveyResponse: UserSurveyResponse = await getRepository(
        UserSurveyResponse
      ).create({
        userId: user.id,
        surveyId: savedSurvey.id,
        completed: false
      });
      const savedUserSurveyResponse: UserSurveyResponse = await getRepository(
        UserSurveyResponse
      ).save(newUserSurveyResponse);
    });

    const to = users
      .map((user) => {
        return user.email;
      })
      .join(', ');

    const from = 'AnkietApp <ankiet@pp.mailgun.org>';
    const subject = `${savedSurvey.description}`;
    const content = `Head to: localhost:4200 and finish your survey! ${savedSurvey.name}`;

    try {
      await sendEmail(to, from, subject, content);
    } catch (e) {
      console.log(e);
      res.status(500);
    }

    return res.status(201).json(savedSurvey);
  } catch (err) {
    return res.send(err);
  }
};

export const updateSurvey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const survey = await getRepository(Survey).findOne(req.params.id);
    if (survey) {
      getRepository(Survey).merge(survey, req.body);
      const results = await getRepository(Survey).save(survey);
      return res.json(results);
    }
  } catch (err) {
    return res.send(err);
  }

  return res.json({ msg: 'No survey found' });
};

export const deleteSurvey = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const results = await getRepository(Survey).delete(req.params.id);
    return res.json(results);
  } catch (err) {
    return res.send(err);
  }
};
