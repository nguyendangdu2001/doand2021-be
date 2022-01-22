import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoomsService } from 'src/chat-rooms/chat-rooms.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  AudioMessage,
  AudioMessageDocument,
  MediaMessage,
  MediaMessageDocument,
  Message,
  MessageDocument,
  TextMessage,
  TextMessageDocument,
} from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    // @InjectModel(TextMessage.name)
    // private readonly textMessageModel: Model<TextMessageDocument>,
    // @InjectModel(MediaMessage.name)
    // private readonly mediaMessageModel: Model<MediaMessageDocument>,
    // @InjectModel(AudioMessage.name)
    // private readonly audioMessageModel: Model<AudioMessageDocument>,
    private chatRoomService: ChatRoomsService,
  ) {}
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }
  async createTextMessage(createMessageDto: CreateMessageDto) {
    const newMessage = await (
      await this.messageModel.create({
        ...createMessageDto,
        replyId: new Types.ObjectId(createMessageDto.replyId),
        from: new Types.ObjectId(createMessageDto.from),
        to: new Types.ObjectId(createMessageDto.to),
      })
    ).populate([
      { path: 'fromUser' },
      { path: 'replyComment', populate: { path: 'fromUser' } },
    ]);
    this.chatRoomService.updateLastMessage(newMessage);
    return newMessage;
  }
  async createMediaMessage(createMessageDto: CreateMessageDto) {
    const newMessage = await this.messageModel.create(createMessageDto);
    this.chatRoomService.updateLastMessage(newMessage);
    return newMessage;
  }
  async createAudioMessage(createMessageDto: CreateMessageDto) {
    const newMessage = await this.messageModel.create(createMessageDto);
    this.chatRoomService.updateLastMessage(newMessage);
    return newMessage;
  }
  async findMessageByChatId(chatId: string) {
    const messages = await this.messageModel
      .find({ to: new Types.ObjectId(chatId) })
      .populate([
        { path: 'fromUser' },
        { path: 'replyComment', populate: { path: 'fromUser' } },
      ]);
    return messages;
  }
  async findMediaByChatId(chatId: string) {
    const messages = await this.messageModel.find({
      to: new Types.ObjectId(chatId),
      type: 'IMAGE',
    });
    const media = messages?.reduce((all, cur) => [...all, ...cur?.files], []);
    return media;
  }
  async findFileByChatId(chatId: string) {
    const messages = await this.messageModel.find({
      to: new Types.ObjectId(chatId),
      type: 'FILE',
    });
    const media = messages?.reduce((all, cur) => [...all, ...cur?.files], []);
    return media;
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(id: string) {
    this.messageModel.updateOne({ _id: id }, { deleted: true });
    return `This action removes a #${id} message`;
  }
}
