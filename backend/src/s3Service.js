const AWS = require("aws-sdk");
const logger = require("./logger");

const region = "us-east-1";
const host = "localhost";
const port = 4566;
const accessKeyId = "test";
const secretAccessKey = "test";
const bucketName = "my-bucket";

AWS.config.update({
  region: `${region}`,
});

const s3 = new AWS.S3({
  endpoint: `http://${host}:${port}`,
  accessKeyId: `${accessKeyId}`,
  secretAccessKey: `${secretAccessKey}`,
  s3ForcePathStyle: true,
});

logger.info("S3 client created");

const corsParams = {
  Bucket: bucketName,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedHeaders: ["*"],
      },
    ],
  },
};

// Setting CORS
try {
  s3.putBucketCors(corsParams)
    .promise()
    .then((data) => {
      logger.info("CORS set successfully", data);
    })
    .catch((err) => {
      logger.error("Error setting CORS", err.message, err.stack);
    });
} catch (err) {
  logger.error("Unexpected error while setting CORS", err);
}

const uploadFile = async (file) => {
  try {
    logger.info("Uploading file:", file.name);
    const params = {
      Bucket: bucketName,
      Key: file.name,
      Body: file.data,
    };

    const data = await s3.upload(params).promise();
    logger.info("File uploaded successfully", data);
    return data;
  } catch (err) {
    logger.error("Error uploading file", err.message, err.stack);
    throw err; // Re-throwing the error to be handled by the caller
  }
};

module.exports = {
  uploadFile,
};
