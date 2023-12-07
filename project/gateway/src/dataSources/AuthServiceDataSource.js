// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000';
	}

	async getUserByEmail(email) {
		debug("gateway/getUserByEmail",)
		debug(`email: ${email}`);

		const params = {email}
		const data = await this.get("/v1/user/", {params});

		debug(`getUserByEmail/data: ${JSON.stringify(data)}`);
		return data;
	}

	async getPasswordComparison(password, hashed) {
		debug("AuthAPI/getPasswordComparison",)
        debug(`password: ${password}`);
        debug(`hashedPassword: ${hashed}`);

        // const data = await this.get("/v1/password-comparison", {
		// 	body: {
		// 		password,
		// 		hashed
		// 	}
        // })

		const params = {password, hashed}
		const data = await this.get("/v1/password-comparison/", {params});

        debug(`getPasswordComparison/data: ${JSON.stringify(data)}`);
		debug(`getPasswordComparison/data as object: ${data}`);
        return data;
	}

	async getTokenByPayload(id, email) {
		debug("getTokenByPayload",)
        debug(`id: ${id}`);
        debug(`email: ${email}`);

        // const data = await this.get("/v1/token-by-payload", {
        //     body: {
        //         id,
        //         email
        //     }
        // })
		const params = {id, email}
		const data = await this.get("/v1/token-by-payload/", {params})

        debug(`getTokenByPayload/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getUserByToken(token) {
		debug("AuthAPI | getUserByToken",)
        debug(`token: ${token}`);

        // const data = await this.get("/v1/user-by-token", {
        //     body: {
        //         token
        //     }
        // })

		const params = {token}
		debug(`params: ${JSON.stringify(params)}`);
		const data = await this.get("/v1/user/", {params})
        debug(`getUserByToken/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getUserByUsername(username) {
		debug("getUserByUsername",)
        debug(`username: ${username}`);

        // const data = await this.get("/v1/user-by-username", {
        //     body: {
        //         username
        //     }
        // })
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

	async getPasswordEncrypted(password) {
		debug("getPasswordEncrypted",)
        debug(`password: ${password}`);

        // const data = await this.get("/v1/password-encrypted", {
        //     body: {
        //         password
        //     }
        // })
		const params = {password}
		const data = await this.get("/v1/password-encrypted", {params})
        debug(`getPasswordEncrypted/data: ${JSON.stringify(data)}`);
        return data;
	}

	async createUser(email, username, password) {
		debug("createUser",)
        debug(`email: ${email}`);
        debug(`username: ${username}`);
        debug(`password: ${password}`);

        const data = await this.post("/v1/user", {
            body: {
                email,
                username,
                password
            }
        })
        debug(`createUser/data: ${JSON.stringify(data)}`);
        return data;
	}

	async changePassword(email, password) {
		debug("changePassword",)
        debug(`email: ${email}`);
        debug(`password: ${password}`);

        const data = await this.put("/v1/new-password", {
            body: {
                email,
                password
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
                username,
                newUsername
            }
        })
        debug(`changeUsername/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getManyUsersByEmail(emails) {
		debug("authService/getManyUsersByEmail",)
        debug(`additionalEmails: ${emails}`);

        // const data = await this.get("/auth-service/many-users-by-email", {
        //     body: {
        //         additionalEmails
        //     }
        // })

		// const joinedEmails = emails.join(",");
		// debug(`joinedEmails: ${joinedEmails}`);
		// const params = {emails: joinedEmails}
		const params ={emails}
		debug(`params: ${JSON.stringify(params)}`);
		try {
			const data = await this.get("/v1/many-users-by-email", {params})
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
                userId,
                contactId
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
