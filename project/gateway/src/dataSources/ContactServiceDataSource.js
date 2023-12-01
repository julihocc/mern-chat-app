const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class ContactAPI extends RESTDataSource {
	constructor(options) {
        super(options);
        this.baseURL = 'http://localhost:4000';
    }

	async sendContactRequest(senderId, recipientId) {
		debug("ContactAPI | sendContactRequest",)
        debug(`senderId: ${senderId}`);
        debug(`recipientId: ${recipientId}`);

        const body = {senderId, recipientId};
        const data = await this.post("/v1/contact-request/", {body});

        debug(`ContactAPI | sendContactRequest | data: ${JSON.stringify(data)}`);
        return data;
	}
}

module.exports = {ContactAPI};