import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne
} from 'typeorm';
import User from './User';
import Survey from './Survey';
import Answer from './Answer';

@Entity()
export default class UserSurveyResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  surveyId: number;

  @Column()
  completed: boolean;

  @OneToMany(() => Answer, (answer) => answer.userSurveyResponse)
  answers: Answer[];

  @ManyToOne(() => User, (user) => user.userSurveyResponses)
  user: User;

  @ManyToOne(() => Survey, (survey) => survey.userSurveyResponses)
  survey: Survey;
}
