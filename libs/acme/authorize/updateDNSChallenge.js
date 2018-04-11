import { RSA } from 'rsa-compat';
import promisify from 'es6-promisify';
import { createHash } from 'crypto';
import { resolveTxt as _resolveTxt } from 'dns';
import updateTXTRecord from '../../aws/route53/updateTXTRecord';
import getHostedZoneId from '../../aws/route53/getHostedZoneId';
import config from '../../../config';

const resolveTxt = promisify(_resolveTxt);

const getTokenDigest = (dnsChallenge, acctKeyPair) =>
  createHash('sha256').update(`${dnsChallenge.token}.${RSA.thumbprint(acctKeyPair)}`).digest();

const urlB64 = buffer => buffer.toString('base64').replace(/[+]/g, '-').replace(/\//g, '_').replace(/=/g, '');

const delayPromise = delay => data =>
  new Promise((resolve, reject) => {
    setTimeout(() => { resolve(data); }, delay);
  });

const retry = (tryCount, promise) =>
  promise(tryCount).then(delayPromise(config['acme-dns-retry-delay-ms']))
    .then(data =>
      ((tryCount < config['acme-dns-retry'] && !data.result)
        ? retry(data.tryCount, promise)
        : data));

const dnsPreCheck = (domain, expect) => (tryCount) => {
  console.log(`[ INFO ] Attempt ${tryCount + 1} to resolve TXT record for ${domain}`);
  return resolveTxt(`_acme-challenge.${domain}`)
    .then(data => ({
      tryCount: ++tryCount,
      result: (data[0][0] === expect),
    }))
    .catch((e) => {
      if (e.code === 'ENODATA' || e.code === 'ENOTFOUND') {
        return { tryCount: ++tryCount, result: false };
      } throw e;
    });
};

const validateDNSChallenge = (domain, dnsChallengeText) =>
  retry(0, dnsPreCheck(domain, dnsChallengeText))
    .then((data) => {
      if (data.result) {
        return data.result;
      }
      throw new Error(`Could not pre-validate DNS TXT record. Didn't find ${dnsChallengeText} in _acme-challenge.${domain}`);
    });


const updateDNSChallenge = (domain, dnsChallenge, acctKeyPair) => {
  const domainName = (typeof domain === 'string') ? domain : domain.name;
  const dnsChallengeText = urlB64(getTokenDigest(dnsChallenge, acctKeyPair));
  return getHostedZoneId(domain)
    .then((id) => {
      console.log(`[ INFO ] Updating DNS TXT Record for ${domainName} to contain ${dnsChallengeText} in Route53 hosted zone ${id}`);
      return updateTXTRecord(id, domainName, dnsChallengeText);
    })
    .then(updated => validateDNSChallenge(domainName, dnsChallengeText))
    .catch((e) => {
      console.error('[ ERROR ] Couldn\'t write token digest to DNS record.', e);
      throw e;
    });
};

module.exports = updateDNSChallenge;
