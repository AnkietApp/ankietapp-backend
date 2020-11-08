import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';

import UserSurveyResponse from './UserSurveyResponse';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(
    () => UserSurveyResponse,
    (userSurveyResponse) => userSurveyResponse.user
  )
  public userSurveyResponses: UserSurveyResponse[];
}
