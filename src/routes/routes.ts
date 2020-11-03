import { UserController } from '../controller/UserController';
import { SurveyController } from '../controller/SurveyController';

export const Routes = [
  {
    method: 'get',
    route: '/users',
    controller: UserController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/users/:id',
    controller: UserController,
    action: 'one'
  },
  {
    method: 'post',
    route: '/users',
    controller: UserController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/users/:id',
    controller: UserController,
    action: 'remove'
  },
  {
    method: 'get',
    route: '/surveys',
    controller: SurveyController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/surveys/:id',
    controller: SurveyController,
    action: 'one'
  },
  {
    method: 'post',
    route: '/surveys',
    controller: SurveyController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/surveys/:id',
    controller: SurveyController,
    action: 'remove'
  }
];
