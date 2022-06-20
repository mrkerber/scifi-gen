import * as sstk from 'shutterstock-api'

const appClientID = 'jbjA2qYzYgKCAwREDqOnwxE3jovPpAFG'
const appClientSecret = 'T4pK1oiv98DDjKgL'
sstk.setBasicAuth(appClientID, appClientSecret);

const imagesApi = new sstk.default.ImagesApi();

const queryParams = {
    "query": "cybernetic scifi",
    "image_type": "photo",
    "page": 1,
    "per_page": 1,
    "sort": "random",
    "view": "minimal"
};

imagesApi.searchImages(queryParams)
    .then((data) => {
        console.log(data.data[0].assets);
    })
    .catch((error) => {
        console.error(error);
    })