const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class ContactAPI extends RESTDataSource {
	constructor(options) {
        super(options);
        this.baseURL = 'http://localhost:4000';
    }

}

module.exports = {ContactAPI};