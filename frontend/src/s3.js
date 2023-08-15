// Importing the dotenv package to load environment variables
const AWS = require('aws-sdk');
const logger = require('loglevel');

// Retrieve the port from the environment variable
const region = 'us-east-1';
const host = 'localhost';
const port = 4566; // default port for localstack
const accessKeyId = 'test'; // dummy credentials
const secretAccessKey = 'test'; // dummy credentials

// Set the AWS region
AWS.config.update({
    region: `${region}`,
});

const s3 = new AWS.S3({
    // The endpoint should now include the port retrieved from the .env file
    endpoint: `http://${host}:${port}`,
    accessKeyId: `${accessKeyId}`,
    secretAccessKey: `${secretAccessKey}`,
    s3ForcePathStyle: true,
});

logger.info('S3 client created');

const bucketName = 'my-bucket'; // Replace with your bucket name

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

module.exports = {s3};
