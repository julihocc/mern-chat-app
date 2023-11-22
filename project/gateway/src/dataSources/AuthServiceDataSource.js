// AuthServiceDataSource.js
const {RESTDataSource} = require("@apollo/datasource-rest");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000/graphql';
		this.context = "aqui va el token"
	}

	async getCurrentUser() {
		console.log("getCurrentUser");
		console.log(this.baseURL);
		console.log(this.context);
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
		console.log(this.baseURL);
		this.context = "cambie el token"
		console.log(this.context);

		const response = await this.post('', {
			body: {
				// query: "mutation Mutation($email: String!, $password: String!) {  login(email: $email, password: $password) {    user {      email    }    token  } }",
				query: `
				mutation Mutation($email: String!, $password: String!) {
					  login(email: $email, password: $password) {
					    user {
					      email
					      id
					      username
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
		console.log(JSON.stringify(response.data.login.user))
		return response.data.login;
	}

}

module.exports = {AuthAPI};
