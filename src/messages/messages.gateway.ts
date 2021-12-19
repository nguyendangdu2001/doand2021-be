import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server } from 'socket.io';
import { IConnectedSocket } from 'src/common/interfaces/connected-socket';
@WebSocketGateway(undefined, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
    transports: ['websocket'],
  },
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer()
  private server: Server;
  @SubscribeMessage('sendMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const newMess = await this.messagesService.createTextMessage(
      createMessageDto,
    );

    this.server
      .to(newMess.to.toString())
      .except(newMess.from.toString())
      .emit('newMessage', newMess);
    return newMess;
  }

  @SubscribeMessage('getInitialMessage')
  async findAll(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    const messages = await this.messagesService.findMessageByChatId(
      data?.roomId,
    );
    socket.emit('initialMessage', { roomId: data?.roomId, messages });
    return messages;
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: string) {
    return this.messagesService.remove(id);
  }
}
