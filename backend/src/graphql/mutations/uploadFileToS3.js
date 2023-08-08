const { uploadFile } = require("../../s3Service");
const logger = require("../../logger"); // Make sure to import your logger module

const uploadFileToS3 = async (parent, args, context) => {
    logger.info("Greetings from the backend! Uploading file to S3");

    const { file, chatRoomId } = args;
    const { pubSub } = context;

  try {
    logger.info("Uploading file to S3:", file.name);
    const uploadedFile = await uploadFile(file);

    logger.info("File uploaded successfully:", uploadedFile);

    pubSub.publish(`FILE_UPLOADED_${chatRoomId}`, {
      fileUploaded: uploadedFile,
    });

    return uploadedFile;
  } catch (err) {
    logger.error("On backend, error uploading file to S3", err.message, err.stack);
    throw err; // Re-throwing the error to be handled by the caller or GraphQL error handler
  }
};

module.exports = { uploadFileToS3 };
