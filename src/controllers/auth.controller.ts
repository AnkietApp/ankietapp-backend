import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository, getConnection } from 'typeorm';
import sendEmail from '../utils/mailgun';

import UserSurveyResponse from '../entity/UserSurveyResponse';
import Survey from '../entity/Survey';
import { INewUserSurveyResponse } from '../interfaces/IUserSurveyResponse';
import User from '../entity/User';
import { JWT_SECRET } from '../utils/secrets';

import { INewUser } from '../interfaces/IUser';

// TODO Set in env
const TOKEN_TIMEOUT = 3600;

function createToken(user: User) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_TIMEOUT
  });
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userFromReq: INewUser = {
    email: req.body.email,
    password: req.body.password,
    isAdmin: Boolean(req.body.isAdmin)
  };

  if (!userFromReq.email || !userFromReq.password) {
    return res
      .status(400)
      .json({ error: { message: 'Please. Send your email and password' } });
  }

  const user = await getRepository(User).findOne({ email: userFromReq.email });
  if (user) {
    return res
      .status(400)
      .json({ error: { message: 'The User already Exists' } });
  }

  const newUser: User = await getRepository(User).create(userFromReq);
  const savedUser: User = await getRepository(User).save(newUser);

  // Get all public Survey Ids
  const surveys = await getRepository(Survey)
    .createQueryBuilder('survey')
    .select(['survey.id'])
    .where('survey.public = :public', { public: true })
    .getMany();

  if (!surveys.length) {
    return res.status(201).json(savedUser);
  }

  // Bulk insert emptySurveyResponses
  const emptyResponses: INewUserSurveyResponse[] = [];

  surveys.forEach((survey) => {
    emptyResponses.push({
      userId: savedUser.id,
      surveyId: survey.id,
      completed: false
    });
  });

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(UserSurveyResponse)
    .values(emptyResponses)
    .execute();

  // Send email to user
  const to = savedUser.email;
  const from = 'AnkietApp <ankiet@pp.mailgun.org>';
  const subject = `Hello ${savedUser.email}, You have surveys to complete!`;
  const content = `Head to: localhost:4200 and finish your surveys!`;

  try {
    await sendEmail(to, from, subject, content);
  } catch (e) {
    console.log(e);
  }

  return res.status(201).json(savedUser);
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: { message: 'Please. Send your email and password' } });
  }

  const user = await getRepository(User).findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return res
      .status(400)
      .json({ error: { message: 'The User does not exists' } });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(200).json({
      idToken: createToken(user),
      localId: user.id,
      expiresIn: TOKEN_TIMEOUT
    });
  }

  return res.status(400).json({
    error: {
      message: 'The email or password are incorrect'
    }
  });
};
