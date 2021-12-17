import { PickType } from '@nestjs/mapped-types';
import { Friend } from '../entities/friend.entity';

export class CreateFriendDto extends PickType(Friend, ['users', 'type']) {}
