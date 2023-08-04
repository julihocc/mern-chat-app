// Importing the dotenv package to load environment variables
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const {info} = require("loglevel");

// Retrieve the port from the environment variable
const region = 'us-east-1';
const host = 'localhost';
const port = 4566; // 4566 is a default value if the PORT variable is not set
const accessKeyId = 'test';
const secretAccessKey = 'test';

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

info('S3 client created');

module.exports = {s3};
