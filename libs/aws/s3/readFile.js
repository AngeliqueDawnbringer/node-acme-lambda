import getS3 from '../sdk/getS3';

const readFile = (bucket, siteId, fileName) =>
  getS3().getObject({
    Bucket: bucket,
    Key: `${siteId}/${fileName}`,
  }).promise()
    .catch((e) => {
      console.error(`[ ERROR ] Couldn't read s3://${bucket}/${siteId}/${fileName}`, e);
      throw e;
    });

module.exports = readFile;
