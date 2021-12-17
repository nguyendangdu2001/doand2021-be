import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { TextMessage } from '../entities/message.entity';

export class CreateMessageDto extends OmitType(TextMessage, ['kind']) {}
