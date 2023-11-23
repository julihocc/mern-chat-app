// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000';
	}

	async getUserByEmail(email) {
		console.log(email);
		console.log(this.baseURL);

		const data = await this.get("/users/email/:email", {})
		debug("response", data);
		return data.results;

	}

	async comparePassword(password, hashedPassword) {
		console.log(password);
        console.log(hashedPassword);

        const data = await this.get("/users/password/:password", {})
        debug("response", data);
        return data.results;
	}

}

module.exports = {AuthAPI};
