// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");
const {internalApiToken} = require("../utils/internalApiToken");

class AuthAPI extends RESTDataSource {
	constructor(options: any) {
		super(options);
		this.baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:5000';
	}

	async willSendRequest(_path: any, request: any) {
		request.headers["x-internal-token"] = internalApiToken();
	}

	async getUserByEmail(email: any) {
		debug("gateway/getUserByEmail",)
		debug(`email: ${email}`);

		const params = {email}
		const data = await this.get("/v1/user/", {params});

		debug(`getUserByEmail/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getPasswordComparison(email: any, password: any) {
		const data = await this.post("/v1/password/compare", {
			body: {email, password},
		});
		return Boolean(data && data.match);
	}

	async getTokenByPayload(id: any, email: any) {
		debug("getTokenByPayload",)
		debug(`id: ${id}`);
		debug(`email: ${email}`);


		const params = {id, email}
		return await this.get("/v1/token/", {params});
	}

	async getUserByToken(token: any) {
		return await this.get("/v1/user/", {
			headers: {authorization: token},
		});
	}

	async getUserByUsername(username: any) {
		debug("getUserByUsername",)
		debug(`username: ${username}`);


		const params = {username}
		const data = await this.get("/v1/user/", {params})
		debug(`getUserByUsername/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getUserById(userId: any) {
		debug("AuthAPI | getUserById")
		debug(`userId: ${userId}`);
		const params = {userId}
		const data = await this.get("/v1/user/", {params})
		debug(`AuthAPI | getUserById | data: ${JSON.stringify(data)}`);
		return data;
	}

	async createUser(email: any, username: any, password: any) {
		debug("createUser",)
		debug(`email: ${email}`);
		debug(`username: ${username}`);

		const data = await this.post("/v1/user", {
			body: {
				email, username, password
			}
		})
		debug(`createUser/data: ${JSON.stringify(data)}`);
		return data;
	}

	async changePassword(email: any, password: any) {
		debug("changePassword",)
		debug(`email: ${email}`);

		const data = await this.put("/v1/password", {
			body: {
				email, password
			}
		})
		debug(`changePassword/data: ${JSON.stringify(data)}`);
		return data;
	}

	async deleteUser(userId: any) {
		return await this.delete("/v1/user", {params: {userId}});
	}

	async changeUsername(username: any, newUsername: any) {
		debug("changeUsername",)
		debug(`username: ${username}`);
		debug(`newUsername: ${newUsername}`);

		const data = await this.put("/v1/user", {
			body: {
				username, newUsername
			}
		})
		debug(`changeUsername/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getManyUsersByEmail(emails: any) {
		debug("authService/getManyUsersByEmail",)
		debug(`additionalEmails: ${emails}`);


		const params = {emails}
		debug(`params: ${JSON.stringify(params)}`);
		try {
			const data = await this.get("/v1/search", {params})
			debug(`getManyUsersByEmail/data: ${JSON.stringify(data)}`);
			return data;
		} catch (error: any) {
			debug(`getManyUsersByEmail/error: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	async addContact(userId: any, contactId: any) {
		debug("addContact",)
		debug(`userId: ${userId}`);
		debug(`contactId: ${contactId}`);

		const data = await this.put("/v1/user", {
			body: {
				userId, contactId
			}
		})
		debug(`addContact/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getContactsByUserId(userId: any) {
		debug("AuthAPI | getContactsByUserId")
		debug(`userId: ${userId}`);
		const params = {userId}
		const data = await this.get("/v1/contacts", {params})
		debug(`AuthAPI | getContactsByUserId | data: ${JSON.stringify(data)}`);
		return data;
	}
}

module.exports = {AuthAPI};
