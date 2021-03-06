import getS3 from '../sdk/getS3';

const saveFile = (bucket, siteId, fileName, fileData, options) =>
  getS3().putObject(Object.assign({
    Bucket: bucket,
    Key: `${siteId}/${fileName}`,
    Body: new Buffer(fileData),
  }, options)).promise()
    .catch((e) => {
      console.error(`[ ERROR ] Couldn't write s3://${bucket}/${siteId}/${fileName}`, e);
      throw e;
    });

module.exports = saveFile;
