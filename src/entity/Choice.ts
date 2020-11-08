import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import Question from './Question';

@Entity()
export default class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Question, (question) => question.choices)
  question: Question;
}
