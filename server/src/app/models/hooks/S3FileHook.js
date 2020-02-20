import S3 from '../../../lib/S3';

import awsConfig from '../../../config/aws';

class S3FileHook {
  deleteS3(s3file) {
    S3.deleteObject(
      { Bucket: awsConfig.bucket, Key: s3file.key },
      function() {}
    );
  }

  getUrl(s3file) {
    const url = S3.getSignedUrl('getObject', {
      Bucket: awsConfig.bucket,
      Key: s3file.key,
    });

    const newS3file = s3file;
    newS3file.url = url;

    return newS3file;
  }
}

export default new S3FileHook();
