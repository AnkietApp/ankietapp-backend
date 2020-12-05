import { getRepository } from 'typeorm';
import Survey from '../entity/Survey';
import User from '../entity/User';
import UserSurveyResponse from '../entity/UserSurveyResponse';
import sendEmail from '../utils/mailgun';

const scheduleEmailReminder = async (): Promise<void> => {
  console.log('You will see this message every minute');
  // Filter out every Survey where dueDate is today
  const today: Date = new Date('2021-04-23T18:25:44.000Z');
  const surveys = await getRepository(Survey)
    .createQueryBuilder('survey')
    .select(['survey.id', 'survey.dueDate'])
    .where('survey.dueDate = :today', { today: today })
    .getMany();
  console.log(surveys);

  // Filter out every UserSurveyResponse where completed is false
  const submittedResponses = await getRepository(UserSurveyResponse)
    .createQueryBuilder('userSurveyResponse')
    .select(['userSurveyResponse.userId'])
    .where('userSurveyResponse.completed = true')
    .getMany();
  console.log(submittedResponses);

  // console.log(Date.now());

  // Find User emails by userId
  const users = await getRepository(User)
    .createQueryBuilder('user')
    .select(['user.email'])
    .where('user.id IN (:...userIds)', {
      userIds: submittedResponses.map((response) => response.userId)
    })
    .getMany();
  console.log(users);

  const to = users
    .map((user) => {
      return user.email;
    })
    .join(', ');

  const from = 'AnkietApp <ankiet@pp.mailgun.org>';
  const subject = `You have survey to complete!`;
  const content = `Head to: localhost:4200 and finish your survey!`;

  try {
    await sendEmail(to, from, subject, content);
  } catch (e) {
    console.log(e);
  }

  // const surveyDate = surveys[0].dueDate.setDate(
  //   surveys[0].dueDate.getDate() - 7
  // );
  // console.log('today: ' + today);
  // console.log(today);
  // console.log('today+: ');
  // console.log(Date.now() - 7 * 24 * 60 * 60 * 1000);
  // console.log('surveys[0].dueDate: ' + surveys[0].dueDate);
  // console.log(surveys[0].dueDate);

  // console.log(surveys[0].dueDate.getTime());
  // if (surveys[0].dueDate.getTime() === today.setTime(today.getDate() + 7)) {
  // if (surveys[0].dueDate === today) {
  if (surveys[0].dueDate.getTime() === today.getTime()) {
    console.log('its today!');
  } else {
    console.log('not equal');
  }
};

export default scheduleEmailReminder;
