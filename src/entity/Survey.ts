import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  deadline: Date;
}
