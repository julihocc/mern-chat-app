const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class ChatAPI extends RESTDataSource {
	constructor(options) {
        super(options);
        this.baseURL = 'http://localhost:4500';
    }
	async getChatRoomById(chatRoomId) {
		debug("getChatRoomById")
		debug(`chatRoomId: ${chatRoomId}`);

		const data = await this.post("/chat-service/getChatRoomById", {
            body: {
                chatRoomId
            }
        })

		debug(`getChatRoomById/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getChatRoomByIdPopulatedWithUsers(chatRoomId) {
		debug("getChatRoomByIdPopulatedWithUsers")
        debug(`chatRoomId: ${chatRoomId}`);

        const data = await this.post("/chat-service/getChatRoomByIdPopulatedWithUsers", {
            body: {
                chatRoomId
            }
        })

        debug(`getChatRoomByIdPopulatedWithUsers/data: ${JSON.stringify(data)}`);
        return data;
	}
}

module.exports = {ChatAPI};