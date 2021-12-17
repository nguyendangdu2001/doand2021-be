import { User } from 'src/users/entities/user.entity';

export interface RegisterInput
  extends Pick<User, 'userName' | 'lastName' | 'firstName'> {
  password: string;
}
