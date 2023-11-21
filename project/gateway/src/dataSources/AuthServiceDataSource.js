// AuthServiceDataSource.js
import { RESTDataSource } from '@apollo/datasource-rest';

class AuthServiceDataSource extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'http://localhost:5000/'; // Replace with your AuthService URL
	}

	async login(email, password) {
		return this.post('', {
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
		return this.post('', {
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
		return this.post('', {
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
		return this.post('', {
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
		return this.post('', {
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

export default AuthServiceDataSource;
