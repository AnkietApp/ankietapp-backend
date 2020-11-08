import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Question from './Question';
import UserSurveyResponse from './UserSurveyResponse';

@Entity()
export default class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @Column()
  userSurveyResponseId: number;

  @Column()
  value: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @ManyToOne(
    () => UserSurveyResponse,
    (userSurveyResponse) => userSurveyResponse.answers
  )
  userSurveyResponse: UserSurveyResponse;
}
