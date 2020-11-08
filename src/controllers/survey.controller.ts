import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import Survey from '../entity/Survey';

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
  try {
    const newSurvey = await getRepository(Survey).create(req.body);
    const results = await getRepository(Survey).save(newSurvey);
    return res.json(results);
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

  return res.json({ msg: 'Not survey found' });
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
