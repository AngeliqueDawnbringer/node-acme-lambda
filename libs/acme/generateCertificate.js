import getDiscoveryUrls from './getDiscoveryUrls';
import getAccount from './register/getAccount';
import getChallenges from './authorize/getChallenges';
import createCertificate from './certify/createCertificate';

module.exports = certInfo =>
  getDiscoveryUrls()
    .then(urls =>
      getAccount(urls['new-reg'])
        .then(account =>
          getChallenges(certInfo.domains, account.key, urls['new-authz'])
            .then(createCertificate(urls['new-cert'], certInfo, account.key))));
