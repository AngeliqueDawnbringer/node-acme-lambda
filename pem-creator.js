import readFile from './libs/aws/s3/readFile';
import saveFile from './libs/aws/s3/saveFile';
import config from './config';

export async function main(event, context) {
  const getPEMsForCertInfo = key =>
    readFile(
      config['s3-cert-bucket'],
      config['s3-folder'],
      `${key}.json`,
    )
      .then(data => JSON.parse(data.Body.toString()))
      .then((certJSON) => {
        console.log(`About to write PEM files for ${key}..`);
        saveFile(
          config['s3-cert-bucket'],
          `${config['s3-folder']}/${key}/pem`,
          'cert.pem',
          certJSON.cert.toString(),
        );
        saveFile(
          config['s3-cert-bucket'],
          `${config['s3-folder']}/${key}/pem`,
          'chain.pem',
          certJSON.issuerCert.toString(),
        );
        saveFile(
          config['s3-cert-bucket'],
          `${config['s3-folder']}/${key}/pem`,
          'fullchain.pem',
          certJSON.cert.toString() + certJSON.issuerCert.toString(),
        );
        // This should contain an if statement, for which it checks to see if the KMS
        // key exists in the config, and if so, to encrypt this key with it and save
        // it as .encrypted
        saveFile(
          config['s3-cert-bucket'],
          `${config['s3-folder']}/${key}/pem`,
          'privkey.pem',
          certJSON.key.privateKeyPem.toString(),
        );
      })
      .catch((e) => {
        console.error('Error writing pem files', e);
      });

  const certificates = certificateDefinitions =>
    Object.keys(certificateDefinitions)
      .map(certKey =>
        getPEMsForCertInfo(certKey, certificateDefinitions[certKey]));

  Promise.all(certificates(config['certificate-definitions']))
    .then(msgs => context.succeed(msgs));
}
