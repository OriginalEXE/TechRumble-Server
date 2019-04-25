const SCWorker = require ('socketcluster/scworker');
const getMentionsCount = require ('../entities/mention/resolvers/get-mentions-count');
const LRU = require ('lru-cache');
require ('../db/init');

const COUNTS_CACHE_OPTIONS = {
  max: 500,
  maxAge: 1000 * 5, // 5 seconds
};
const countsCache = new LRU (COUNTS_CACHE_OPTIONS);

const emitMentionsCount = ({ scServer, category }) => {
  if (countsCache.get (category)) {
    scServer.exchange.publish (
      `${category}Counts`,
      {
        counts: countsCache.get (category),
        errors: [],
      },
    );
    return;
  }

  getMentionsCount ({
    input: {
      category,
    },
  })
    .then (({ counts, errors }) => {
      if (!errors.length) {
        countsCache.set (category, counts);
      }

      scServer.exchange.publish (
        `${category}Counts`,
        {
          counts,
          errors,
        },
      );
    });
};

class Worker extends SCWorker {
  run () {
    console.log ('   >> Worker PID:', process.pid);
    const scServer = this.scServer;

    scServer.on ('connection', (socket) => {
      socket.on ('getMentionsCount', ({ category }) => {
        emitMentionsCount ({ scServer, category });
      });
    });

    this.on ('masterMessage', (action) => {
      if (action.type === 'getMentionsCount') {
        emitMentionsCount ({ scServer, category: action.payload.category });
      }
    });
  }
}

new Worker ();
