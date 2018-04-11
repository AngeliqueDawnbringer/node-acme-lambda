import generateCertificate from './libs/acme/generateCertificate';
import isExpired from './libs/util/isExpired';
import config from './config';

export async function main(event, context, callback) {

  const singleCertificate = (key, domains) =>
    isExpired(key)
      .then(expired =>
        (expired
          ? generateCertificate({ key, domains })
          : {
            err: false,
            msg: `Certificate for ${key} is still valid, skipping renewal.`,
          }
        ))
      .catch(err => ({
        err: true,
        msg: `Updating cert for ${key}, received err ${err}, ${err.stack}`,
      }));

  const certificates = certificateDefinitions =>
    Object.keys(certificateDefinitions)
      .map(certKey =>
        singleCertificate(certKey, certificateDefinitions[certKey]));

  Promise.all(certificates(config['certificate-definitions']))
    .then(msgs => context.succeed(msgs));
}
