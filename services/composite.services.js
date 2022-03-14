const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const headers = {
 'Content-Type': 'application/json',
 Accept: 'application/json',
 'COAST-TOKEN': `${process.env.COAST_TOKEN}`,
 'OP-USER-TOKEN': `${process.env.OP_USER_TOKEN}`
};
const baseUrl = `${process.env.OPENPRINT_URL}`;

changeCompositeToDownloaded = (compositeId) => {
 let id = {
   composite_id: compositeId
 }
 const config = {
  method: 'POST',
  headers,
  data: id
 };
 return axios(`${baseUrl}/change_composite_to_downloaded`, config)
  .then(responseSuccessHandler)
  .catch(responseErrorHandler);
};

const responseSuccessHandler = (response) => {
 return response.data;
};

const responseErrorHandler = (error) => {
 console.log(error);
 return Promise.reject(error);
};

module.exports = {
 changeCompositeToDownloaded: changeCompositeToDownloaded
};
