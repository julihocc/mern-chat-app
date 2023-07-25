const AWS = require('aws-sdk');

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

module.exports = s3;
