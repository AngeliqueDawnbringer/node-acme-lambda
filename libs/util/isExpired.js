import forge from 'node-forge';
import config from '../../config';
import readFile from '../aws/s3/readFile';

const diffDays = (certExpiration, now) =>
  Math.round(Math.abs((certExpiration.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

const certInValid = (cert, date) =>
  (cert.notBefore > date > cert.notAfter || diffDays(new Date(cert.validity.notAfter), date) < config['renew-before-expiry']);

module.exports = certKey =>
  readFile(
    config['s3-cert-bucket'],
    config['s3-folder'],
    `${certKey}.json`,
  )
    .then(data =>
      certInValid(forge.pki.certificateFromPem(JSON.parse(data.Body.toString()).cert), new Date()))
    .catch((e) => {
      if (e.statusCode === 404) {
        console.log(`[ INFO ] Certificate with key ${certKey} is missing, going to (re)generate.`);
        return true;
      }
      console.error('[ ERROR ] Undefined error while calculating cert expiration', e);
      throw e;
    });
