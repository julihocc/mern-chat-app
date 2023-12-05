const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class ContactAPI extends RESTDataSource {
	constructor(options) {
        super(options);
        this.baseURL = 'http://localhost:4000';
    }

	async sendContactRequest(senderId, recipientId) {
		debug("ContactAPI | sendContactRequest",)
        debug(`senderId: ${senderId}`);
        debug(`recipientId: ${recipientId}`);

        const body = {senderId, recipientId};
        const data = await this.post("/v1/contact-request/", {body});

        debug(`ContactAPI | sendContactRequest | data: ${JSON.stringify(data)}`);
        return data;
	}

	async acceptContactRequest(requestId) {
		debug(`ContactAPI | acceptContactRequest | requestId: ${requestId}`);

		const body = {requestId, status: "accepted"};
		const data = await this.put("/v1/contact-request/", {body});

		debug(`ContactAPI | acceptContactRequest | data: ${JSON.stringify(data)}`);
		return data;
	}

	async rejectContactRequest(requestId) {
		debug(`ContactAPI | rejectContactRequest | requestId: ${requestId}`);

        const body = {requestId, status: "rejected"};
        const data = await this.put("/v1/contact-request/", {body});

        debug(`ContactAPI | rejectContactRequest | data: ${JSON.stringify(data)}`);
        return data;
	}

	async getContactRequest(requestId) {
		debug(`ContactAPI | getContactRequest | requestId: ${requestId}`);

		const params = {requestId};
        const data = await this.get(`/v1/contact-request`, {params});

        debug(`ContactAPI | getContactRequest | data: ${JSON.stringify(data)}`);
        return data;
	}

	async addChatRoomIdToContactRequest(requestId, chatRoomId) {
		debug(`ContactAPI | addChatRoomIdToContactRequest`);
		debug(`requestId: ${requestId}`);
		debug(`chatRoomId: ${chatRoomId}`);

        const body = {requestId, chatRoomId};
        const data = await this.put("/v1/contact-request/", {body});

        debug(`ContactAPI | addChatRoomIdToContactRequest | data: ${JSON.stringify(data)}`);
        return data;
	}

	async createUser(_id, email, username) {
		debug("ContactAPI | createUser");
        debug(`_id: ${_id}`);
        debug(`email: ${email}`);
        debug(`username: ${username}`);

        const body = {_id, email, username};
        const data = await this.post("/v1/user", {body});

        debug(`ContactAPI | createUser | data: ${JSON.stringify(data)}`);
        return data;
	}

	async changeUsername(username, newUsername) {
		debug("ContactAPI | changeUsername");
        debug(`username: ${username}`);
        debug(`newUsername: ${newUsername}`);

        const body = {username, newUsername};
        const data = await this.put("/v1/user", {body});

        debug(`ContactAPI | changeUsername | data: ${JSON.stringify(data)}`);
        return data;
	}

	async createChatRoomWithParticipantIds(chatRoomId, participantIds) {
		debug("ContactAPI | createChatRoomWithParticipantIds");
		debug(`chatRoomId: ${chatRoomId}`);
        debug(`participantIds: ${participantIds}`);

        const body = {chatRoomId, participantIds};
        const data = await this.post("/v1/chat-room", {body});

        debug(`ContactAPI | createChatRoomWithParticipantIds | data: ${JSON.stringify(data)}`);
        return data;
	}
}

module.exports = {ContactAPI};