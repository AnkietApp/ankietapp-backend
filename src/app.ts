import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import { CronJob } from 'cron';

import passportConfig from './config/passport';

import userRoutes from './routes/user.routes';
import surveyRoutes from './routes/survey.routes';
import authRoutes from './routes/auth.routes';
import userSurveyResponseRoutes from './routes/usersurveyresponse.routes';
import scheduleEmailReminder from './jobs/emailReminderJob';

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
app.use(userSurveyResponseRoutes);

const job = new CronJob(
  '00 12 * * *',
  () => {
    scheduleEmailReminder();
  },
  null,
  true,
  'Europe/Berlin'
);

// Start express server
app.listen(8080, () => {
  console.log('Express server has started on port 8080');
  job.start();
});
