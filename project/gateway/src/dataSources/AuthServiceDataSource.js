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

}

module.exports = {AuthAPI};
