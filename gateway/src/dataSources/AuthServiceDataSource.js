// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:5000';
	}

	async getUserByEmail(email) {
		debug("gateway/getUserByEmail",)
		debug(`email: ${email}`);

		const params = {email}
		const data = await this.get("/v1/user/", {params});

		debug(`getUserByEmail/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getPasswordComparison(email, password) {
		const data = await this.post("/v1/password/compare", {
			body: {email, password},
		});
		return Boolean(data && data.match);
	}

	async getTokenByPayload(id, email) {
		debug("getTokenByPayload",)
		debug(`id: ${id}`);
		debug(`email: ${email}`);


		const params = {id, email}
		return await this.get("/v1/token/", {params});
	}

	async getUserByToken(token) {
		return await this.get("/v1/user/", {
			headers: {authorization: token},
		});
	}

	async getUserByUsername(username) {
		debug("getUserByUsername",)
		debug(`username: ${username}`);


		const params = {username}
		const data = await this.get("/v1/user/", {params})
		debug(`getUserByUsername/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getUserById(userId) {
		debug("AuthAPI | getUserById")
		debug(`userId: ${userId}`);
		const params = {userId}
		const data = await this.get("/v1/user/", {params})
		debug(`AuthAPI | getUserById | data: ${JSON.stringify(data)}`);
		return data;
	}

	async createUser(email, username, password) {
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

	async changePassword(email, password) {
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

	async changeUsername(username, newUsername) {
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

	async getManyUsersByEmail(emails) {
		debug("authService/getManyUsersByEmail",)
		debug(`additionalEmails: ${emails}`);


		const params = {emails}
		debug(`params: ${JSON.stringify(params)}`);
		try {
			const data = await this.get("/v1/search", {params})
			debug(`getManyUsersByEmail/data: ${JSON.stringify(data)}`);
			return data;
		} catch (error) {
			debug(`getManyUsersByEmail/error: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	async addContact(userId, contactId) {
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

	async getContactsByUserId(userId) {
		debug("AuthAPI | getContactsByUserId")
		debug(`userId: ${userId}`);
		const params = {userId}
		const data = await this.get("/v1/contacts", {params})
		debug(`AuthAPI | getContactsByUserId | data: ${JSON.stringify(data)}`);
		return data;
	}
}

module.exports = {AuthAPI};
