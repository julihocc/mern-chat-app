// AuthServiceDataSource.js
const { RESTDataSource } = require("@apollo/datasource-rest");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000/graphql'; // Replace with your AuthService URL
	}

	async login(email, password) {
		return this.post('login', { email, password });
	}

}

module.exports = {AuthAPI};
