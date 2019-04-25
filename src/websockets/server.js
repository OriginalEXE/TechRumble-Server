const SocketCluster = require ('socketcluster');
const fs = require ('fs');
const path = require ('path');
const events = require ('../events');

const socketCluster = new SocketCluster ({
  workers: 1,
  brokers: 1,
  port: 3000,
  appName: 'techrumble',
  workerController: `${__dirname}/worker.js`,
  protocol: process.env.NODE_ENV === 'production'
    ? 'http'
    : 'https',
  protocolOptions: process.env.NODE_ENV === 'production'
  ? null
  : {
    key: fs.readFileSync (
      path.resolve(
        __dirname,
        process.env.SC_DEV_CERTIFICATE_KEY,
      ),
    ),
    cert: fs.readFileSync (
      path.resolve(
        __dirname,
        process.env.SC_DEV_CERTIFICATE_CERT,
      ),
    ),
  },
});

const newCountListeners = {};

socketCluster.on ('workerStart', ({ id }) => {
  newCountListeners[id] = ({ category }) => {
    socketCluster.sendToWorker (
      id,
      { type: 'getMentionsCount', payload: { category }},
    );
  };

  events.on ('mentionsCountUpdated', newCountListeners[id]);
});

socketCluster.on ('workerExit', ({ id }) => {
  events.off ('mentionsCountUpdated', newCountListeners[id]);
});
