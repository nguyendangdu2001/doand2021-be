import { Router } from 'mediasoup/node/lib/Router';
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup/node/lib/RtpParameters';
import { DtlsParameters, DtlsState } from 'mediasoup/node/lib/WebRtcTransport';
import { Worker } from 'mediasoup/node/lib/Worker';
import { Server } from 'socket.io';
import groupVideoChatConfig from './config';
import { Peer } from './Peer';
interface User {
  _id: string;
  name: string;
}
export class Room {
  private id: string;
  private peers = new Map<string, Peer>();
  private io: Server;
  private users = new Map<string, User>();
  private user_master: string;
  private router: Router;
  constructor(
    room_id: string,
    worker: Worker,
    io: Server,
    user_master: string,
  ) {
    this.id = room_id;
    const mediaCodecs = groupVideoChatConfig.mediasoup.router.mediaCodecs;
    worker
      .createRouter({
        mediaCodecs,
      })
      .then(
        function (router) {
          this.router = router;
        }.bind(this),
      );

    this.io = io;

    this.user_master = user_master;
  }

  addPeer(peer: Peer) {
    this.peers.set(peer.id, peer);
  }

  async addUser(user: User) {
    this.users.set(user._id, user);
  }

  getUserOfRoom(id: string) {
    console.log(this.users);
    return this.users.get(id);
  }

  getUsersOfRoom() {
    const userList = [];
    this.users.forEach((user) => {
      userList.push(user);
    });
    return userList;
  }

  getProducerListForPeer(socket_id: string) {
    const producerList = [];
    this.peers.forEach((peer) => {
      peer.producers.forEach((producer) => {
        producerList.push({
          producer_id: producer.id,
        });
      });
    });
    return producerList;
  }

  getRtpCapabilities() {
    return this.router.rtpCapabilities;
  }

  async createWebRtcTransport(socket_id) {
    const { maxIncomingBitrate, initialAvailableOutgoingBitrate } =
      groupVideoChatConfig.mediasoup.webRtcTransport;

    const transport = await this.router.createWebRtcTransport({
      listenIps: groupVideoChatConfig.mediasoup.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }

    transport.on(
      'dtlsstatechange',
      function (dtlsState: DtlsState) {
        if (dtlsState === 'closed') {
          console.log(
            '---transport close--- ' +
              this.peers.get(socket_id).name +
              ' closed',
          );
          transport.close();
        }
      }.bind(this),
    );

    transport.on('close', () => {
      console.log(
        '---transport close--- ' + this.peers.get(socket_id).name + ' closed',
      );
    });
    console.log('---adding transport---', transport.id);
    this.peers.get(socket_id).addTransport(transport);
    return {
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  }

  async connectPeerTransport(
    socket_id: string,
    transport_id: string,
    dtlsParameters: DtlsParameters,
  ) {
    if (!this.peers.has(socket_id)) return;
    await this.peers
      .get(socket_id)
      .connectTransport(transport_id, dtlsParameters);
  }

  async produce(
    socket_id: string,
    producerTransportId: string,
    rtpParameters: RtpParameters,
    kind: MediaKind,
  ) {
    // handle undefined errors
    return new Promise(
      async function (resolve, reject) {
        const producer = await this.peers
          .get(socket_id)
          .createProducer(producerTransportId, rtpParameters, kind);
        resolve(producer.id);
        this.broadCast(socket_id, 'newProducers', [
          {
            producer_id: producer.id,
            producer_socket_id: socket_id,
          },
        ]);
      }.bind(this),
    );
  }

  async consume(
    socket_id: string,
    consumer_transport_id: string,
    producer_id: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    // handle nulls
    if (
      !this.router.canConsume({
        producerId: producer_id,
        rtpCapabilities,
      })
    ) {
      console.error('can not consume');
      return;
    }

    const { consumer, params } = await this.peers
      .get(socket_id)
      .createConsumer(consumer_transport_id, producer_id, rtpCapabilities);

    consumer.on(
      'producerclose',
      function () {
        console.log(
          `---consumer closed--- due to producerclose event  name:${
            this.peers.get(socket_id).name
          } consumer_id: ${consumer.id}`,
        );
        this.peers.get(socket_id).removeConsumer(consumer.id);
        // tell client consumer is dead
        this.io.to(socket_id).emit('consumerClosed', {
          consumer_id: consumer.id,
        });
      }.bind(this),
    );

    return params;
  }

  async removePeer(socket_id: string) {
    this.peers.get(socket_id).close();
    this.peers.delete(socket_id);
  }

  async removeUser(id: string) {
    this.users.delete(id);
  }

  closeProducer(socket_id: string, producer_id: string) {
    this.peers.get(socket_id).closeProducer(producer_id);
  }

  broadCast(socket_id: string, name: string, data: any) {
    for (const otherID of Array.from(this.peers.keys()).filter(
      (id) => id !== socket_id,
    )) {
      this.send(otherID, name, data);
    }
  }

  send(socket_id: string, name: string, data: any) {
    this.io.to(socket_id).emit(name, data);
  }

  getPeers() {
    return this.peers;
  }

  toJson() {
    return {
      id: this.id,
      peers: JSON.stringify([...this.peers]),
    };
  }
}
