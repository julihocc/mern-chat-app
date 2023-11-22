// AuthServiceDataSource.js
const { RESTDataSource } = require("@apollo/datasource-rest");

class AuthAPI extends RESTDataSource {
	constructor(options) {
		super(options);
		this.baseURL = 'http://localhost:5000/'; // Replace with your AuthService URL
	}

	async login(email, password) {
		return this.post('graphql', {
			query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            token
            user {
              id
              email
            }
          }
        }
      `
		});
	}

	async signUp(username, email, password) {
		return this.post('graphql', {
			query: `
        mutation {
          signUp(username: "${username}", email: "${email}", password: "${password}") {
            token
            user {
              id
              email
            }
          }
        }
      `
		});
	}

	async changePassword(userId, newPassword) {
		return this.post('graphql', {
			query: `
        mutation {
          changePassword(userId: "${userId}", newPassword: "${newPassword}") {
            success
            message
          }
        }
      `
		});
	}

	async changeUsername(userId, newUsername) {
		return this.post('graphql', {
			query: `
        mutation {
          changeUsername(userId: "${userId}", newUsername: "${newUsername}") {
            success
            message
          }
        }
      `
		});
	}

	async logout(userId) {
		return this.post('graphql', {
			query: `
        mutation {
          logout(userId: "${userId}") {
            success
            message
          }
        }
      `
		});
	}

}

module.export = {AuthAPI};
