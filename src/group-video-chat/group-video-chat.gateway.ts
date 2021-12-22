import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import groupVideoChatConfig from './config';
import { GroupVideoChatService } from './group-video-chat.service';
import * as mediasoup from 'mediasoup';
import { Worker } from 'mediasoup/node/lib/Worker';
import { Room } from './Room';
import { IConnectedSocket } from 'src/common/interfaces/connected-socket';
import { Server } from 'socket.io';
import { Peer } from './Peer';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup/node/lib/RtpParameters';
@WebSocketGateway()
export class GroupVideoChatGateway implements OnGatewayDisconnect {
  private workers: Worker[] = [];
  private nextMediasoupWorkerIdx = 0;
  private roomList = new Map<string, Room>();
  @WebSocketServer()
  private io: Server;
  constructor(private readonly groupVideoChatService: GroupVideoChatService) {
    this.createWorkers();
  }
  handleDisconnect(socket: IConnectedSocket) {
    console.log(
      `---disconnect--- name: ${
        this.roomList.get(socket.room_id) &&
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    if (!socket.room_id) return;
    const room = this.roomList.get(socket.room_id);
    if (!room) return;
    const userExit = room.getUserOfRoom(socket.id);
    room.removePeer(socket.id);
    room.removeUser(socket.id);
    const userOfRoom = room.getUsersOfRoom();
    console.log(userExit);
    userOfRoom.forEach((user) => {
      if (user._id == socket.id) return;
      socket.to(user._id).emit('delete-user', {
        users: userOfRoom,
        user: userExit,
      });
    });
  }
  async createWorkers() {
    const { numWorkers } = groupVideoChatConfig.mediasoup;

    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: 'warn',
        logTags: groupVideoChatConfig.mediasoup.worker.logTags,
        rtcMinPort: groupVideoChatConfig.mediasoup.worker.rtcMinPort,
        rtcMaxPort: groupVideoChatConfig.mediasoup.worker.rtcMaxPort,
      });

      worker.on('died', () => {
        console.error(
          'mediasoup worker died, exiting in 2 seconds... [pid:%d]',
          worker.pid,
        );
        setTimeout(() => process.exit(1), 2000);
      });
      this.workers.push(worker);

      // log worker resource usage
      /*setInterval(async () => {
            const usage = await worker.getResourceUsage();

            console.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
        }, 120000);*/
    }
  }
  getMediasoupWorker() {
    const worker = this.workers[this.nextMediasoupWorkerIdx];

    if (++this.nextMediasoupWorkerIdx === this.workers.length)
      this.nextMediasoupWorkerIdx = 0;

    return worker;
  }
  @SubscribeMessage('createRoom')
  createRoom(
    @MessageBody() { room_id }: { room_id: string },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    if (this.roomList.has(room_id)) {
      return 'already exists';
    } else {
      console.log('---created room--- ', room_id);
      const worker = this.getMediasoupWorker();
      this.roomList.set(room_id, new Room(room_id, worker, this.io, socket.id));
      return room_id;
    }
  }
  @SubscribeMessage('join')
  async join(
    @MessageBody() { room_id, name }: { room_id: string; name: string },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    console.log('---user joined--- "' + room_id + '": ' + name);
    if (!this.roomList.has(room_id)) {
      return {
        error: 'room does not exist',
      };
    }
    this.roomList.get(room_id).addPeer(new Peer(socket.id, name));
    socket.room_id = room_id;
    const produceList = this.roomList
      .get(room_id)
      .getProducerListForPeer(socket.id);
    console.log(produceList);

    await this.roomList.get(room_id).addUser({
      _id: socket.id,
      name: name,
    });
    const userOfRoom = this.roomList.get(room_id).getUsersOfRoom();
    userOfRoom.forEach((user) => {
      if (user._id == socket.id) return;
      socket.to(user._id).emit('new-user', {
        users: userOfRoom,
        user: {
          _id: socket.id,
          name,
        },
      });
    });
    return {
      peers: this.roomList.get(room_id).toJson(),
      data: {
        user: {
          _id: room_id,
          name,
        },
        users: userOfRoom,
      },
    };
  }
  @SubscribeMessage('getProducers')
  getProducers(
    // @MessageBody() { room_id }: { room_id: string },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    console.log(
      `---get producers--- name:${
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    // send all the current producer to newly joined member
    if (!this.roomList.has(socket.room_id)) return;
    const producerList = this.roomList
      .get(socket.room_id)
      .getProducerListForPeer(socket.id);
    socket.emit('newProducers', producerList);
    console.log(socket.rooms);
    return producerList;
  }
  @SubscribeMessage('getRouterRtpCapabilities')
  getRouterRtpCapabilities(
    // @MessageBody() { room_id }: { room_id: string },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    console.log(
      `---get RouterRtpCapabilities--- name: ${
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    try {
      return this.roomList.get(socket.room_id).getRtpCapabilities();
    } catch (e) {
      return {
        error: e.message,
      };
    }
  }
  @SubscribeMessage('createWebRtcTransport')
  async createWebRtcTransport(
    // @MessageBody() { room_id }: { room_id: string },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    console.log(
      `---create webrtc transport--- name: ${
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    try {
      const { params } = await this.roomList
        .get(socket.room_id)
        .createWebRtcTransport(socket.id);

      return params;
    } catch (err) {
      console.error(err);
      return {
        error: err.message,
      };
    }
  }
  @SubscribeMessage('connectTransport')
  async connectTransport(
    @MessageBody()
    {
      dtlsParameters,
      transport_id,
    }: { transport_id: string; dtlsParameters: DtlsParameters },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    console.log(
      `---connect transport--- name: ${
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    if (!this.roomList.has(socket.room_id)) return;
    await this.roomList
      .get(socket.room_id)
      .connectPeerTransport(socket.id, transport_id, dtlsParameters);

    return 'success';
  }
  @SubscribeMessage('produce')
  async produce(
    @MessageBody()
    {
      kind,
      producerTransportId,
      rtpParameters,
    }: {
      kind: MediaKind;
      rtpParameters: RtpParameters;
      producerTransportId: string;
    },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    if (!this.roomList.has(socket.room_id)) {
      return { error: 'not is a room' };
    }

    const producer_id = await this.roomList
      .get(socket.room_id)
      .produce(socket.id, producerTransportId, rtpParameters, kind);
    console.log(
      `---produce--- type: ${kind} name: ${
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      } id: ${producer_id}`,
    );
    return {
      producer_id,
    };
  }
  @SubscribeMessage('consume')
  async consume(
    @MessageBody()
    {
      consumerTransportId,
      producerId,
      rtpCapabilities,
    }: {
      consumerTransportId: string;
      producerId: string;
      rtpCapabilities: RtpCapabilities;
    },
    @ConnectedSocket() socket: IConnectedSocket,
  ) {
    const params = await this.roomList
      .get(socket.room_id)
      .consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

    console.log(
      `---consuming--- name: ${
        this.roomList.get(socket.room_id) &&
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      } prod_id:${producerId} consumer_id:${params.id}`,
    );
    return params;
  }
  // @SubscribeMessage('resume')
  // async resume() {
  //   await consumer.resume();
  //   return;
  // }
  @SubscribeMessage('getMyRoomInfo')
  async getMyRoomInfo(@ConnectedSocket() socket: IConnectedSocket) {
    return this.roomList.get(socket.room_id).toJson();
  }
  @SubscribeMessage('producerClosed')
  async producerClosed(
    @ConnectedSocket() socket: IConnectedSocket,
    @MessageBody() { producer_id }: { producer_id: string },
  ) {
    console.log(
      `---producer close--- name: ${
        this.roomList.get(socket.room_id) &&
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    this.roomList.get(socket.room_id).closeProducer(socket.id, producer_id);
  }

  @SubscribeMessage('exitRoom')
  async exitRoom(
    @ConnectedSocket() socket: IConnectedSocket,
    // @MessageBody() { producer_id }: { producer_id: string },
  ) {
    console.log(
      `---exit room--- name: ${
        this.roomList.get(socket.room_id) &&
        this.roomList.get(socket.room_id).getPeers().get(socket.id).name
      }`,
    );
    if (!this.roomList.has(socket.room_id)) {
      return {
        error: 'not currently in a room',
      };
    }
    // close transports
    await this.roomList.get(socket.room_id).removePeer(socket.id);
    await this.roomList.get(socket.room_id).removeUser(socket.id);
    if (this.roomList.get(socket.room_id).getPeers().size === 0) {
      this.roomList.delete(socket.room_id);
    }

    socket.room_id = null;

    return 'successfully exited room';
  }
}
