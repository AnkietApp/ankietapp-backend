import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import User from '../entity/User';
import { JWT_SECRET } from '../utils/secrets';

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
  if (!req.body.email || !req.body.password) {
    return (
      res
        .status(400)
        // TODO Refactor return message to be not redundant. Extract to different module
        .json({ error: { message: 'Please. Send your email and password' } })
    );
  }

  const user = await getRepository(User).findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ error: { message: 'The User already Exists' } });
  }
  const newUser = await getRepository(User).create({
    ...req.body,
    isAdmin: false
  });
  const savedUser = await getRepository(User).save(newUser);
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
