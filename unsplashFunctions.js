import { createApi } from "unsplash-js";
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';

global.fetch = fetch;
dotenv.config();

var unsplashAPI = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
});

export const fetchPicture = async (queryString) => {
    let result = await unsplashAPI.search.getPhotos({
        query: queryString,
        page: 1,
        perPage: 1
    })
    if (result.type === 'success') {
        let photo = await result.response.results[0];
        unsplashAPI.photos.trackDownload({
            downloadLocation: photo.links.download_location
        });
        const imageData = await fetch(photo.links.download, {
            method: 'GET',
            headers: {Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY}
        })
        const buffer = await imageData.buffer();
        fs.writeFile( './data/img/pending.png', buffer, () => {//'./data/img/' + queryString + '_' + photo.id + '.png', buffer, () => {
            console.log('Image download complete');
        })
        // .then(res =>
        //     res.body.pipe(fs.createWriteStream('./data/img/' + photo.id + '.png'))
        // )
        return photo;
    } else 
        return 'error';
}