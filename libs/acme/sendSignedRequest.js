import { RSA } from 'rsa-compat';
import { post } from 'superagent';
import getNonce from './getNonce';

const sendSignedRequest = (payload, keypair, url) =>
  getNonce()
    .then(data =>
      post(url)
        .send(RSA.signJws(keypair, new Buffer(JSON.stringify(payload)), data)));

module.exports = sendSignedRequest;
