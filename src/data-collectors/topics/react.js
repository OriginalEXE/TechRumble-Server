const createMention = require ('../../entities/mention/resolvers/create-mention');
const checkMatchWeight = require ('../utils/check-match-weight');
const webDictionary = require ('../dictionaries/web');
const { addListener: addTwitterListener } = require ('../sources/twitter');

const init = () => {
  addTwitterListener ({
    keywords: [
      'react',
      'reactjs',
      'react.js',
    ],
    callback: (tweet) => {
      const source = tweet.retweeted_status
        ? tweet.retweeted_status.text
        : tweet.text;

      if (!checkMatchWeight({
        source,
        dictionary: webDictionary,
        minWeight: 10,
      })) {
        return;
      }

      createMention({
        input: {
          mentionData: {
            name: 'react',
            category: 'JavaScriptFramework',
            source: 'twitter',
          },
        },
      });
    }
  });
};

module.exports = init;
