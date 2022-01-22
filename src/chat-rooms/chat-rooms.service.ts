import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from 'src/messages/entities/message.entity';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ChatRoom, ChatRoomDocument } from './entities/chat-room.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
    private readonly chatRoomGateway: ChatRoomsGateway,
  ) {}
  async create(createChatRoomDto: CreateChatRoomDto) {
    return await this.chatRoomModel.create(createChatRoomDto);
  }
  async createFriendChatRoom(createChatRoomDto: CreateChatRoomDto) {
    const room = await this.chatRoomModel.findOne({
      usersId: { $all: createChatRoomDto.usersId },
      type: 'PRIVATE',
    });
    if (room) return room;
    const chatRoom = await (
      await this.chatRoomModel.create(createChatRoomDto)
    ).populate('users');
    chatRoom.usersId.map((user) => {
      this.chatRoomGateway.newChatRoom(user.toString(), chatRoom);
    });
    return chatRoom;
  }
  async getOrcreateFriendVideoChatRoom(roomId: string) {
    const room = await this.chatRoomModel.findOne({
      of: new Types.ObjectId(roomId),
      type: 'VIDEO_PRIVATE',
    });
    console.log('video room', roomId, room);

    if (room) return room;
    const chatRoom = await this.chatRoomModel.create({
      of: new Types.ObjectId(roomId),
      type: 'VIDEO_PRIVATE',
    });
    return chatRoom;
  }
  async joinVideoChatRoom(roomId: string, userId: string) {
    const room = await this.getOrcreateFriendVideoChatRoom(roomId);
    return room;
    // const room.update({ $addToSet: { usersId: new Types.ObjectId(userId) } });
  }
  async createGroupChatRoom(createChatRoomDto: CreateChatRoomDto) {
    const room = await this.chatRoomModel.find({
      usersId: { $all: createChatRoomDto.usersId },
      type: 'GROUP',
    });
    if (room) return room;
    const chatRoom = await this.chatRoomModel.create(createChatRoomDto);
    chatRoom.usersId.map((user) => {
      this.chatRoomGateway.newChatRoom(user.toString(), chatRoom);
    });
    return chatRoom;
  }

  findAll() {
    return `This action returns all chatRooms`;
  }
  async findAllForUser(userId: string) {
    return await this.chatRoomModel
      .find(
        { usersId: new Types.ObjectId(userId) },
        {},
        { sort: { updatedAt: 1 } },
      )
      .populate({ path: 'users', match: { type: 'PRIVATE' } })
      .populate('lastMessage.fromUser');
  }

  async findOne(id: string) {
    return await this.chatRoomModel.findById(id).populate('users');
  }

  async findOnePrivate(user1: string, user2: string) {
    return await this.chatRoomModel.find({
      type: 'PRIVATE',
      users: { $all: [user1, user2] },
    });
  }
  async addUserToGroup(userId: string, groupId: string) {
    return await this.chatRoomModel.updateOne(
      { _id: groupId, type: 'GROUP' },
      { $addToSet: { usersId: userId } },
      { new: true },
    );
  }
  async updateLastMessage(message: Message) {
    const chatRoom = await this.chatRoomModel.findByIdAndUpdate(
      message.to,
      { lastMessage: message },
      { new: true },
    );
    chatRoom.lastMessage = message;
    this.chatRoomGateway.newChatRoomMessage({
      ...chatRoom?.toObject(),
      lastMessage: message,
    } as any);
  }

  update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    return `This action updates a #${id} chatRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatRoom`;
  }
  async removeVideoRoom(id: string) {
    return await this.chatRoomModel.deleteOne({
      of: new Types.ObjectId(id),
      type: 'VIDEO_PRIVATE',
    });
  }
  async removeVideoRoomByUser(userId: string) {
    return await this.chatRoomModel.findOneAndDelete({
      usersId: new Types.ObjectId(userId),
      type: 'VIDEO_PRIVATE',
    });
  }
}
