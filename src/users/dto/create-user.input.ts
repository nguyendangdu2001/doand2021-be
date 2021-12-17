import { Google } from '../entities/user.entity';

export class CreateUserInput {
  firstName?: string;

  lastName: string;

  userName?: string;

  password?: string;

  avatar?: string;

  google?: Google;
}
