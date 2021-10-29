import twit from 'twit';
import dotenv from 'dotenv';

dotenv.config();

var client = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,  //optional
  strictSSL: false  //optional
})

export const postTweet = async (statusString) => {

  client.post('statuses/update', {status: statusString}, function(err, data, response) {
    //console.log(data);
  })

  return('Tweet Posted');

}
