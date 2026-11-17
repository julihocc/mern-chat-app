const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");
const {internalApiToken} = require("../utils/internalApiToken");

class ChatAPI extends RESTDataSource {
	constructor(options: any) {
        super(options);
        this.baseURL = process.env.CHAT_SERVICE_URL || 'http://localhost:4500';
    }

	async willSendRequest(_path: any, request: any) {
		request.headers["x-internal-token"] = internalApiToken();
	}
	async getChatRoomById(chatRoomId: any) {
		debug("getChatRoomById")
		debug(`chatRoomId: ${chatRoomId}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/chat-room", {params})
		debug(`ChatAPI | getChatRoomById | data: ${JSON.stringify(data)}`);
		return data;
	}

	async getChatRoomByIdPopulatedWithUsers(chatRoomId: any) {
		debug("getChatRoomByIdPopulatedWithUsers")
        debug(`chatRoomId: ${chatRoomId}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/chat-room-populated", {params})
		debug(`ChatAPI | getChatRoomByIdPopulatedWithUsers | data: ${JSON.stringify(data)}`);

        return data;
	}

	async getMessagesByChatRoomId(chatRoomId: any) {
		debug("getMessagesByChatRoomId",)
		debug(`chatRoomId: ${chatRoomId}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/messages", {params})

		return data;
	}

	async saveMessage(chatRoomId: any, senderId: any, body: any, fileContent: any) {
		debug("saveMessage")
        debug(`chatRoomId: ${chatRoomId}`)
        debug(`senderId: ${senderId}`)
        debug(`body: ${body}`)

        const data = await this.post("/v1/message", {
            body: {
                chatRoomId,
                senderId,
                body,
                fileContent
            }
        })
		debug(`ChatAPI | saveMessage | data: ${JSON.stringify(data)}`);
        return data;
	}

	async getChatRoomByParticipantIds(participantIds: any) {
		debug("getChatRoomByParticipantIds")
        debug(`participantIds: ${participantIds}`);

		const params = {participantIds}
        const data = await this.get("/v1/chat-room", {params})
        debug(`ChatAPI | getChatRoomByParticipantIds | data: ${JSON.stringify(data)}`);

        return data;
	}

	async createChatRoomWithParticipantIds(participantIds: any) {
		debug("ChatAPI | createChatRoomWithParticipantIds")
        debug(`participantIds: ${participantIds}`);

        const data = await this.post("/v1/chat-room", {
            body: {
                participantIds
            }
        })
        debug(`ChatAPI | createChatRoomWithParticipantIds | data: ${JSON.stringify(data)}`);
        return data;
	}

	async createUser(_id: any, email: any, username: any) {
		debug("ChatAPIT | createUser")
        debug(`_id: ${_id}`)
        debug(`email: ${email}`)
        debug(`username: ${username}`)

        const data = await this.post("/v1/user", {
            body: {
                _id,
                email,
                username
            }
        })
        debug(`createUser/data: ${JSON.stringify(data)}`);
        return data;
	}

	async deleteUser(userId: any) {
		return await this.delete("/v1/user", {params: {userId}});
	}

	async changeUsername(username: any, newUsername: any) {
		debug("ChatAPIT | updateUser")
        debug(`username: ${username}`)
        debug(`newUsername: ${newUsername}`)

        const data = await this.put("/v1/user", {
            body: {
                username,
                newUsername
            }
        })
        debug(`updateUser/data: ${JSON.stringify(data)}`);
        return data;
	}

	async startSchoolRoom(studentId: any, groupId: any, body: any) {
		return await this.post("/v1/school-room", {body: {studentId, groupId, body}});
	}

	async claimSchoolRoom(chatRoomId: any, expertId: any) {
		return await this.post("/v1/school-room/claim", {body: {chatRoomId, expertId}});
	}

	async listWaitingRooms(groupId: any) {
		return await this.get("/v1/school-rooms", {params: {groupId}});
	}

	async getMessage(messageId: any) {
		return await this.get("/v1/message", {params: {messageId}});
	}

	async saveDocument(filename: any, scope: any, groupId: any, file: any, uploadedBy: any) {
		return await this.post("/v1/knowledge/document", {
			body: {filename, scope, groupId, file, uploadedBy},
		});
	}

	async searchKnowledge(groupId: any, q: any) {
		return await this.get("/v1/knowledge/search", {params: {groupId, q}});
	}

	async saveMarkedAnswer(groupId: any, questionText: any, answerText: any, messageId: any, markedBy: any) {
		return await this.post("/v1/marked-answer", {
			body: {groupId, questionText, answerText, messageId, markedBy},
		});
	}

	async getChatRoomsByUserId(userId: any) {
		debug("ChatAPI | getChatRoomsForCurrentUser")
		debug(`userId: ${userId}`);
		const data = await this.get("/v1/search", {
            params: {
                userId
            }
        })
		debug(`ChatAPI | getChatRoomsForCurrentUser | data: ${JSON.stringify(data)}`);
		return data;
	}
}

module.exports = {ChatAPI};