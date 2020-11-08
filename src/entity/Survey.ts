import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsDate } from 'class-validator';
import Question from './Question';
import UserSurveyResponse from './UserSurveyResponse';

@Entity()
export default class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  @IsDate()
  dueDate: Date;

  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];

  @OneToMany(
    () => UserSurveyResponse,
    (userSurveyResponse) => userSurveyResponse.survey
  )
  userSurveyResponses: UserSurveyResponse[];
}
