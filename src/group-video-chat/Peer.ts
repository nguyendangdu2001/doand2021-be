import { Consumer } from 'mediasoup/node/lib/Consumer';
import { Producer } from 'mediasoup/node/lib/Producer';
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup/node/lib/RtpParameters';
import { Transport } from 'mediasoup/node/lib/Transport';

export class Peer {
  public id: string;
  public name: string;
  private transports = new Map<string, Transport>();
  private consumers = new Map<string, Consumer>();
  public producers = new Map<string, Producer>();
  private master: boolean;
  constructor(socket_id: string, name: string, master = false) {
    this.id = socket_id;
    this.name = name;
  }

  addTransport(transport: Transport) {
    this.transports.set(transport.id, transport);
  }

  async connectTransport(transport_id: string, dtlsParameters: any) {
    if (!this.transports.has(transport_id)) return;
    await this.transports.get(transport_id).connect({
      dtlsParameters: dtlsParameters,
    });
  }

  async createProducer(
    producerTransportId: string,
    rtpParameters: RtpParameters,
    kind: MediaKind,
  ) {
    //TODO handle null errors
    const producer = await this.transports.get(producerTransportId).produce({
      kind,
      rtpParameters,
    });

    this.producers.set(producer.id, producer);

    producer.on(
      'transportclose',
      function () {
        console.log(
          `---producer transport close--- name: ${this.name} consumer_id: ${producer.id}`,
        );
        producer.close();
        this.producers.delete(producer.id);
      }.bind(this),
    );

    return producer;
  }

  async createConsumer(
    consumer_transport_id: string,
    producer_id: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const consumerTransport = this.transports.get(consumer_transport_id);

    let consumer = null;
    try {
      consumer = await consumerTransport.consume({
        producerId: producer_id,
        rtpCapabilities,
        paused: false, //producer.kind === 'video',
      });
    } catch (error) {
      console.error('consume failed', error);
      return;
    }

    if (consumer.type === 'simulcast') {
      await consumer.setPreferredLayers({
        spatialLayer: 2,
        temporalLayer: 2,
      });
    }

    this.consumers.set(consumer.id, consumer);

    consumer.on(
      'transportclose',
      function () {
        console.log(
          `---consumer transport close--- name: ${this.name} consumer_id: ${consumer.id}`,
        );
        this.consumers.delete(consumer.id);
      }.bind(this),
    );

    return {
      consumer,
      params: {
        producerId: producer_id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      },
    };
  }

  closeProducer(producer_id: string) {
    try {
      this.producers.get(producer_id).close();
    } catch (e) {
      console.warn(e);
    }

    this.producers.delete(producer_id);
  }

  getProducer(producer_id) {
    return this.producers.get(producer_id);
  }

  close() {
    this.transports.forEach((transport) => transport.close());
  }

  removeConsumer(consumer_id: string) {
    this.consumers.delete(consumer_id);
  }
}
