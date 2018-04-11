import generateRSAKeyPair from '../../util/generateRSAKeyPair';
import newCertificate from './newCertificate';
import generateCSR from '../../util/generateCSR';
import config from '../../../config';
import saveFile from '../../aws/s3/saveFile';

const saveCertificate = data =>
  saveFile(
    config['s3-cert-bucket'],
    config['s3-folder'],
    `${data.key}.json`,
    JSON.stringify({
      key: data.keypair,
      cert: data.cert,
      issuerCert: data.issuerCert,
    }),
  );

const createCertificate = (certUrl, certInfo, acctKeyPair) => authorizations =>
  generateRSAKeyPair()
    .then(domainKeypair =>
      generateCSR(domainKeypair, certInfo.domains)
        .then(newCertificate(acctKeyPair, authorizations, certUrl))
        .then(certData =>
          saveCertificate({
            key: certInfo.key,
            keypair: domainKeypair,
            cert: certData.cert,
            issuerCert: certData.issuerCert,
          })));

module.exports = createCertificate;
