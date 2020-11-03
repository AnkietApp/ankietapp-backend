import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;
}
