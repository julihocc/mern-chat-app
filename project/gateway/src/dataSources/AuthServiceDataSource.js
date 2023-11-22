// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000/graphql'; // Replace with your AuthService URL
	}

	async getCurrentUser() {
		console.log("getCurrentUser");
		const response = await this.post("", {
			body: {
                query: "query Query {  getCurrentUser { username  } }",
            },
		});
		console.log(response);
		return response.data.data.getCurrentUser;
	}

	async login(email, password) {
		console.log(email, password);
		const response = await this.post('', {
			body: {
				// query: "mutation Mutation($email: String!, $password: String!) {  login(email: $email, password: $password) {    user {      email    }    token  } }",
				query: `
				mutation Mutation($email: String!, $password: String!) {
					  login(email: $email, password: $password) {
					    user {
					      email
					    }
					    token
					  }
					}
				`, variables: {
					email, password,
				}
			},
		});
		console.log(response);
		return response.data.login;
	}

}

module.exports = {AuthAPI};
