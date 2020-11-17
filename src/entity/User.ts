import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  Unique
} from 'typeorm';
import bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

import UserSurveyResponse from './UserSurveyResponse';

@Entity()
@Unique(['email'])
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(
    () => UserSurveyResponse,
    (userSurveyResponse) => userSurveyResponse.user
  )
  public userSurveyResponses: UserSurveyResponse[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}
