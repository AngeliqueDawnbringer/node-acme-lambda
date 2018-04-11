import { get } from 'superagent';
import config from '../../config';

const getNonce = () =>
  get(`${config['acme-directory-url']}/directory`)
    .then(data => data.header['replay-nonce'])
    .catch((e) => {
      console.error('Error getting nonce', e);
      throw e;
    });

module.exports = getNonce;
