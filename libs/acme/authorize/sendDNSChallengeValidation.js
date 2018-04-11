import { RSA } from 'rsa-compat';
import sendSignedRequest from '../sendSignedRequest';

const sendDNSChallengeValidation = (dnsChallenge, acctKeyPair) => sendSignedRequest({
  resource: 'challenge',
  keyAuthorization: `${dnsChallenge.token}.${RSA.thumbprint(acctKeyPair)}`,
}, acctKeyPair, dnsChallenge.uri)
  .then(data => data.body)
  .catch((e) => {
    console.error('[ ERROR ] Couldn\'t send DNS challenge verification.', e);
    throw e;
  });

module.exports = sendDNSChallengeValidation;
