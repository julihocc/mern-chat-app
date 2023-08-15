// backend/src/s3Handler.js
const AWS = require("aws-sdk");
const { s3 } = require("./s3");
const logger = require('../logger');



// Function to upload a file to S3
const uploadFileToS3 = async (fileBuffer, bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
    };
    try {
        return s3.upload(params).promise();
    } catch (err) {
        logger.error(`Failed to upload file: ${err}`); // Log this error
        throw new Error('Failed to upload file'); // Propagate the error to the client
    }
};

module.exports = { uploadFileToS3 };
