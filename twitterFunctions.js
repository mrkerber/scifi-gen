import twit from 'twit';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

var client = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,  //optional
  strictSSL: false  //optional
})

// export const postTweet = async (statusString) => {

//   client.post('statuses/update', {status: statusString}, function(err, data, response) {
//     //console.log(data);
//   })

//   return('Tweet Posted');

// }



export const postTweet = async (statusString) => {

  const pendingImage = await fs.readFileSync('./data/img/pending.png', {encoding: 'base64'});
  await client.post('media/upload', {media: pendingImage}, function(error, media, repsonse) {
    if (error) {
      console.log(error)
    } else {
      client.post('statuses/update', {status: statusString, media_ids: media.media_id_string}, function(error, tweet, response) {
        if(error) {
          console.log(error)
        } else {
          console.log("Tweet/Image successful")
        }
      })
    }
  })

}
