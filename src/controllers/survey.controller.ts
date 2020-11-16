import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';

import Survey from '../entity/Survey';
import Question from '../entity/Question';
import Choice from '../entity/Choice';
import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION
} from '../utils/constants';

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
  try {
    const results = await getRepository(Survey).findOne(req.params.id);
    return res.json(results);
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
    dueDate: req.body.dueDate
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
    return res.json(savedSurvey);
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
