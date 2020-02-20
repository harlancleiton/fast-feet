import aws from 'aws-sdk';

import awsConfig from '../config/aws';

export default new aws.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});
