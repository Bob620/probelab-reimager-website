const express = require('express');

const version1 = require('./api/1/index.js');

class APIPages {
	constructor() {
		this.router = express.Router();

		this.router.use('/1/', version1);

		this.router.use((req, res) => {
			res.status(404);
			res.json({type: 'error', message: 'Unsupported operation'});
		});
	}
}

module.exports = APIPages;
