import { get } from 'superagent';
import config from '../../config';

const getDiscoveryUrls = discoveryUrl =>
  get(`${config['acme-directory-url']}/directory`)
    .then(data => data.body);

module.exports = getDiscoveryUrls;
