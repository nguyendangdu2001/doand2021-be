import { RouterOptions } from 'mediasoup/node/lib/Router';
import { WorkerSettings } from 'mediasoup/node/lib/Worker';
import os from 'os';
const address = '127.0.0.1';
const workerSettings: WorkerSettings = {
  rtcMinPort: 10000,
  rtcMaxPort: 10100,
  logLevel: 'warn',
  logTags: [
    'info',
    'ice',
    'dtls',
    'rtp',
    'srtp',
    'rtcp',
    // 'rtx',
    // 'bwe',
    // 'score',
    // 'simulcast',
    // 'svc'
  ],
};
const routerConfig: RouterOptions = {
  mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: 'video',
      mimeType: 'video/h264',
      clockRate: 90000,
      parameters: {
        'x-google-start-bitrate': 1000,
      },
    },
    {
      kind: 'screen' as any,
      mimeType: 'video/VP8',
      clockRate: 90000,
      parameters: {
        'x-google-start-bitrate': 1000,
      },
    },
  ],
};
const groupVideoChatConfig = {
  listenIp: '0.0.0.0',
  listenPort: 3016,
  sslCrt: '../ssl/cert.pem',
  sslKey: '../ssl/key.pem',

  mediasoup: {
    // Worker settings
    numWorkers: Object.keys(os.cpus()).length,
    worker: workerSettings,
    // Router settings
    router: routerConfig,
    // WebRtcTransport settings
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: address, // replace by public IP address
        },
      ],
      maxIncomingBitrate: 1500000,
      initialAvailableOutgoingBitrate: 1000000,
    },
  },
};
export default groupVideoChatConfig;
