import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from 'src/common/decorators';
import { MessagesService } from 'src/messages/messages.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(
    private readonly chatRoomsService: ChatRoomsService,
    private readonly chatRoomsGateway: ChatRoomsGateway,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  create(
    @Body() createChatRoomDto: CreateChatRoomDto,
    @User() user: UserEntity,
  ) {
    return this.chatRoomsService.create(createChatRoomDto);
  }
  @Post('group')
  async createGroup(
    @Body() createChatRoomDto: CreateChatRoomDto,
    @User() user: UserEntity,
  ) {
    const room = await this.chatRoomsService.create({
      ...createChatRoomDto,
      type: 'GROUP',
      usersId: [...createChatRoomDto.usersId, user?._id],
    });
    room?.usersId?.forEach((id) => {
      this.chatRoomsGateway.newChatRoom(id?.toString(), room);
    });
    return room;
  }

  @Get()
  findAll() {
    return this.chatRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatRoomsService.findOne(id);
  }
  @Get(':id/media')
  findOneMedia(@Param('id') id: string) {
    return this.messagesService.findMediaByChatId(id);
  }
  @Get(':id/file')
  findOneFile(@Param('id') id: string) {
    return this.messagesService.findFileByChatId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
  ) {
    return this.chatRoomsService.update(+id, updateChatRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatRoomsService.remove(+id);
  }
}
