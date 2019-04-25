const Twit = require('twit');

const listeners = [];
const TwitClient = new Twit ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


const addListener = ({
  keywords,
  callback,
}) => {
  listeners.push ({
    keywords,
    callback,
  });
};


const init = () => {
  const keywords = listeners.reduce ((keywords, listener) => [
    ...keywords,
    ...listener.keywords,
  ], []);
  const tweetsStream = TwitClient.stream ('statuses/filter', { track: keywords });

  tweetsStream.on ('tweet', (tweet) => {
    // We hort-circuit the loop if at least one keyword matches, we don't
    // want multiple matches per Tweet for the same topic
    listeners.some (({ keywords, callback }) => {
      const atLeastOneKeywordMatches = keywords.some((keyword) => {
        const normalizedSource = tweet.retweeted_status
          ? tweet.retweeted_status.text.toLowerCase ()
          : tweet.text.toLowerCase ();
        const regex = RegExp(`\\b${keyword}\\b`, 'gi');

        if (!regex.test (normalizedSource)) {
          return false;
        }

        return true;
      });

      if (atLeastOneKeywordMatches) {
        callback (tweet);
      }

      return atLeastOneKeywordMatches;
    });
  });
};

exports.client = TwitClient;
exports.addListener = addListener;
exports.init = init;
