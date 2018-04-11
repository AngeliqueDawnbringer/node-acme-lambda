import AWS from 'aws-sdk';

const getSTS = async () => {
  const sts = new AWS.STS({ region: process.env.REGION });
  const params = {
    RoleArn: 'arn:aws:iam::212404561329:role/CertificateManager',
    RoleSessionName: 'CrossAccountCredentials',
    ExternalId: '4bb5b44b-e1a2-441d-94e8-9e03e41ac27b',
    DurationSeconds: 3600,
  };

  const assumeRoleStep1 = await sts.assumeRole(params).promise();
  console.log('Changed Credentials');

  const accessparams = {
    accessKeyId: assumeRoleStep1.Credentials.AccessKeyId,
    secretAccessKey: assumeRoleStep1.Credentials.SecretAccessKey,
    sessionToken: assumeRoleStep1.Credentials.SessionToken,
  };

  const s3 = await new AWS.S3(accessparams);

  s3.putObject({
    Body: 'text',
    Bucket: 'certificate-api-ccp-settings',
    Key: 'helloworld.txt',
  }, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });

  const sts2 = new AWS.STS(accessparams);
  const params2 = {
    RoleArn: 'arn:aws:iam::452543470410:role/CertificateOrchestrator-prod-iamgw',
    RoleSessionName: 'CrossAccountCredentials-prod-ccp-rio-iamgw-team',
    ExternalId: '863ead18-a916-4644-b10e-440b62b8858d',
  };

  const assumeRoleStep2 = await sts2.assumeRole(params2).promise();
  console.log(assumeRoleStep2);

  const accessparams2 = {
    accessKeyId: assumeRoleStep2.Credentials.AccessKeyId,
    secretAccessKey: assumeRoleStep2.Credentials.SecretAccessKey,
    sessionToken: assumeRoleStep2.Credentials.SessionToken,
  };

  const s32 = await new AWS.S3(accessparams2);

  s32.putObject({
    Body: `Angeliques test ${new Date().toLocaleString()}`,
    Bucket: 'ccp-certificate-manager-prod-cert-iamgw',
    ServerSideEncryption: 'AES256',
    Key: 'helloworld.txt',
  }, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });

  return assumeRoleStep1;
};

module.exports = getSTS;
