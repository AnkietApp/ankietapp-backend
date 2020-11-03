import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express, { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routes/routes';
import { User } from './entity/User';
import { Survey } from './entity/Survey';

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: NextFunction) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(
      connection.manager.create(User, {
        firstName: 'john',
        lastName: 'doe'
      })
    );
    await connection.manager.save(
      connection.manager.create(Survey, {
        name: 'Hello Survey',
        deadline: new Date().toLocaleString()
      })
    );

    console.log('Express server has started on port 3000');
  })
  .catch((error) => console.log(error));
