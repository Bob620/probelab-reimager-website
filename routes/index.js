const express = require('express');

class StandardPages {
	constructor() {
		this.router = express.Router();

		/* GET landing page. */
		this.router.get('/', (req, res) => {
			res.render('index');
		});
	}
}

module.exports = StandardPages;
