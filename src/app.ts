import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';

import passportConfig from './config/passport';

import userRoutes from './routes/user.routes';
import surveyRoutes from './routes/survey.routes';
import authRoutes from './routes/auth.routes';

const app = express();
createConnection();

// Middlewares
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(morgan('dev'));

// Passport configuration
passport.use(passportConfig);

// Routes
app.use(userRoutes);
app.use(surveyRoutes);
app.use(authRoutes);

// Start express server
app.listen(8080, () => console.log('Express server has started on port 8080'));
