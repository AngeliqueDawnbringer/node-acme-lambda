import sendSignedRequest from '../sendSignedRequest';
import downloadBinary from '../../util/downloadBinary';

const toIssuerCert = (links) => {
  const match = /.*<(.*)>;rel="up".*/.exec(links);
  return match[1];
};

const toStandardB64 = (str) => {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/').replace(/=/g, '');
  switch (b64.length % 4) {
    case 2: b64 += '=='; break;
    case 3: b64 += '='; break;
  }
  return b64;
};

const toPEM = (cert) => {
  cert = toStandardB64(cert.toString('base64'));
  cert = cert.match(/.{1,64}/g).join('\n');
  // doing this twice, oneliner has awkward behaviour
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
};

const newCertificate = (keypair, authorizations, certUrl) => (csr) => {
  console.log('[ INFO ] Requesting certificate from lets-encrypt');
  return sendSignedRequest({
    resource: 'new-cert',
    csr,
    authorizations,
  }, keypair, certUrl)
    .then(data =>
      downloadBinary(data.header.location)
        .then(certificate =>
          downloadBinary(toIssuerCert(data.header.link))
            .then((issuerCert) => {
              console.log('[ INFO ] Downloaded certificate');
              return ({
                cert: toPEM(certificate),
                issuerCert: toPEM(issuerCert),
              });
            })));
};

module.exports = newCertificate;
