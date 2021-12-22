import * as SocketIO from 'socket.io';
import { Socket } from 'socket.io/node_modules/engine.io';
import { UserEntity } from 'src/users/entities/user.entity';

export interface IConnectedSocket extends SocketIO.Socket {
  conn: Socket & {
    token: string;
    userId: string;
  };
  data: {
    token?: string;
    user?: UserEntity;
  };
  room_id: string;
}
