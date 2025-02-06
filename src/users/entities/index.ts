import { Users } from './user.entity';
export { Users } from './user.entity';

export const userProvider = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: Users,
  },
];
