const AWS = require('aws-sdk');
const logger = require('loglevel');

// Retrieve AWS_SDK_LOAD_CONFIG from environment variables
const awsSdkLoadConfig = process.env.AWS_SDK_LOAD_CONFIG || 1;
const awsRegion = process.env.AWS_REGION || 'us-east-1';
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || 'AKIARYSRN25M3DRCYPER';
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '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';

logger.info('Creating S3 client')
logger.info('AWS_SDK_LOAD_CONFIG', awsSdkLoadConfig);
logger.info('AWS_REGION', awsRegion);
logger.info('AWS_ACCESS_KEY_ID', awsAccessKeyId);
logger.info('AWS_SECRET_ACCESS_KEY', awsSecretAccessKey);

// Set the AWS region and credentials
AWS.config.update({
    accessKeyId: awsAccessKeyId, // Obtained from environment variable
    secretAccessKey: awsSecretAccessKey, // Obtained from environment variable
    region: awsRegion, // Use environment variable or default to 'us-east-1'
    sdkLoadConfig: awsSdkLoadConfig // Optional: Include AWS_SDK_LOAD_CONFIG for future use
});

const s3 = new AWS.S3();

logger.info('S3 client created');

const bucketName = process.env.REACT_APP_S3_BUCKET_NAME; // Updated this line
logger.info('Creating bucket', bucketName);

const corsParams = {
    Bucket: bucketName,
    CORSConfiguration: {
        CORSRules: [
            {
                "AllowedHeaders": ["*"],
                "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
                "AllowedOrigins": ["http://a6a481e2aee0a42c8bc0b0dd3c1d3308-1537438412.us-east-1.elb.amazonaws.com:3000"],
                "ExposeHeaders": []
            }
        ],
    },
};

s3.putBucketCors(corsParams).promise()
    .then(data => {
        logger.info('CORS set successfully', data);
    })
    .catch(err => {
        logger.error('Error setting CORS', err.message, err.stack);
    });

module.exports = { s3 };
