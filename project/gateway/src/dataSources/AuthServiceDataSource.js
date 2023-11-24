// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000';
	}

	async getUserByEmail(email) {
		debug("getUserByEmail",)
		debug(`email: ${email}`);

		const data = await this.post("/auth-service/getUserByEmail/", {
			body: {
				email
			}
		})

		debug(`getUserByEmail/data: ${JSON.stringify(data)}`);
		return data;

	}

	async getPasswordComparison(password, hashed) {
		debug("getPasswordComparison",)
        debug(`password: ${password}`);
        debug(`hashedPassword: ${hashed}`);

        const data = await this.post("/auth-service/getPasswordComparison", {
			body: {
				password,
				hashed
			}
        })

        debug(`getPasswordComparison/data: ${JSON.stringify(data)}`);
		debug(`getPasswordComparison/data as object: ${data}`);
        return data;
	}

	async getTokenByPayload(id, email) {
		debug("getTokenByPayload",)
        debug(`id: ${id}`);
        debug(`email: ${email}`);

        const data = await this.post("/auth-service/getTokenByPayload", {
            body: {
                id,
                email
            }
        })
        debug(`getTokenByPayload/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getUserByToken(token) {
		debug("getUserByToken",)
        debug(`token: ${token}`);

        const data = await this.post("/auth-service/getUserByToken", {
            body: {
                token
            }
        })
        debug(`getUserByToken/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getUserByUsername(username) {
		debug("getUserByUsername",)
        debug(`username: ${username}`);

        const data = await this.post("/auth-service/getUserByUsername", {
            body: {
                username
            }
        })
        debug(`getUserByUsername/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getPasswordEncrypted(password) {
		debug("getPasswordEncrypted",)
        debug(`password: ${password}`);

        const data = await this.post("/auth-service/getPasswordEncrypted", {
            body: {
                password
            }
        })
        debug(`getPasswordEncrypted/data: ${JSON.stringify(data)}`);
        return data;
	}

	async createUser(email, username, password) {
		debug("createUser",)
        debug(`email: ${email}`);
        debug(`username: ${username}`);
        debug(`password: ${password}`);

        const data = await this.post("/auth-service/createUser", {
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

        const data = await this.post("/auth-service/changePassword", {
            body: {
                email,
                password
            }
        })
        debug(`changePassword/data: ${JSON.stringify(data)}`);
        return data;
	}

}

module.exports = {AuthAPI};
