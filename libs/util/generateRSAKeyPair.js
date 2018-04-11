import { RSA } from 'rsa-compat';
import promisify from 'es6-promisify';
import config from '../../config';

const bitlen = config['acme-account-key-bits'];
const exp = 65537;
const options = { public: true, pem: true, internal: true };
const generateKeyPair = promisify(RSA.generateKeypair);

const generatePair = () =>
  generateKeyPair(bitlen, exp, options)
    .catch((e) => {
      console.error('[ ERROR ] Couldn\'t generate RSA keypair', e);
      throw e;
    });

module.exports = generatePair;
