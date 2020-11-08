import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm';
import Survey from './Survey';
import Answer from './Answer';
import Choice from './Choice';

@Entity()
export default class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  sortOrder: number;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => Choice, (choice) => choice.question)
  choices: Choice[];

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;
}
