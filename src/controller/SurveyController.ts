import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Survey } from '../entity/Survey';

export class SurveyController {
  private surveyRepository = getRepository(Survey);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.surveyRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.surveyRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.surveyRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let surveyToRemove = await this.surveyRepository.findOne(request.params.id);
    await this.surveyRepository.remove(surveyToRemove);
  }
}
