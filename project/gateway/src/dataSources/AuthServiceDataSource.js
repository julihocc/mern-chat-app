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

		const data = await this.get("/users/email/:email", {})
		debug(`data: ${JSON.stringify(data)}`);
		return data.results;

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
        debug(`data: ${JSON.stringify(data)}`);
        return data.results;
	}

}

module.exports = {AuthAPI};
