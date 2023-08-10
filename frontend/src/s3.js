const AWS = require('aws-sdk');
const logger = require('loglevel');

// Retrieve AWS_SDK_LOAD_CONFIG from environment variables
const awsSdkLoadConfig = process.env.AWS_SDK_LOAD_CONFIG;

// Set the AWS region and credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Obtained from environment variable
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Obtained from environment variable
    region: process.env.AWS_REGION || 'us-east-1', // Use environment variable or default to 'us-east-1'
    sdkLoadConfig: awsSdkLoadConfig // Optional: Include AWS_SDK_LOAD_CONFIG for future use
});

const s3 = new AWS.S3();

logger.info('S3 client created');

const bucketName = process.env.REACT_APP_S3_BUCKET_NAME; // Updated this line

const corsParams = {
    Bucket: bucketName,
    CORSConfiguration: {
        CORSRules: [
            {
                AllowedOrigins: ['*'], // Allow all origins
                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'], // Allowed methods
                AllowedHeaders: ['*'], // Allow all headers
            },
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
