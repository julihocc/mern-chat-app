// path: backend\src\graphql\resolvers\mutations\s3.js
// description: This file contains the code for the s3 resolver.
// The s3 resolver is used to upload files to AWS S3.

const AWS = require('aws-sdk');
const logger = require('../../logger');

// Set the AWS region
AWS.config.update({
    region: 'us-east-1',
});

const s3 = new AWS.S3({
    // The endpoint should match the URL of your LocalStack instance
    // Default URL is as follows:
    endpoint: 'http://localhost:4566',
    // These can be whatever arbitrary values
    accessKeyId: 'test',
    secretAccessKey: 'test',
    // This is required for LocalStack
    s3ForcePathStyle: true,
});

logger.info('S3 instance created.'); // log the info

module.exports = s3;
