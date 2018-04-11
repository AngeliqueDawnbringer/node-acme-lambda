import { S3 } from 'aws-sdk';

const getS3 = () => new S3({ signatureVersion: 'v4' });

module.exports = getS3;
