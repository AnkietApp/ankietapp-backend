import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import surveyRoutes from './routes/survey.routes';

const app = express();
createConnection();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use(userRoutes);
app.use(surveyRoutes);

// Start express server
app.listen(8080, () => console.log('Express server has started on port 8080'));
