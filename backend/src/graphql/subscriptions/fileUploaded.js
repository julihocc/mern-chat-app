const fileUploaded = {
    subscribe: (parent, { chatRoomId }, { pubSub }) => {
        //logger.info('loading fileUploaded'); // Log the info
        //logger.info(`fileUploaded: ${chatRoomId}`); // Log the info
        return pubSub.asyncIterator(`FILE_UPLOADED_${chatRoomId}`);
    }
}

module.exports = {
    fileUploaded
}
