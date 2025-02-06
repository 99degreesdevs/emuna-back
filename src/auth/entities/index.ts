import { Auth } from './auth.entity';
export { Auth } from './auth.entity';

export const authProvider = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: Auth,
  },
];