// AuthServiceDataSource.js
const { RESTDataSource } = require("@apollo/datasource-rest");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000'; // Replace with your AuthService URL
	}

	async login(email, password) {
		const response = await this.post('', {
			query: `
            mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    user {
                        email
                    }
                    token
                }
            }
        `,
			variables: {
				email,
				password
			}
		});
		return response.data.login;
	}


}

module.exports = {AuthAPI};
