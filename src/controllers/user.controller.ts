import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await getRepository(User).find();
  return res.json(users);
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const results = await getRepository(User).findOne(req.params.id);
  return res.json(results);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const newUser = await getRepository(User).create(req.body);
  const savedUser = await getRepository(User).save(newUser);

  return res.json(savedUser);
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = await getRepository(User).findOne(req.params.id);
  if (user) {
    getRepository(User).merge(user, req.body);
    const results = await getRepository(User).save(user);
    return res.json(results);
  }

  return res.json({ msg: 'Not user found' });
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const results = await getRepository(User).delete(req.params.id);
  return res.json(results);
};
