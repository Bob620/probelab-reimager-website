const express = require('express');

const Redis = require('./api/redis.js');

class StandardPages {
	constructor() {
		const redis = new Redis();
		this.router = express.Router();

		/* GET landing page. */
		this.router.get('/', (req, res) => {
			res.render('index');
		});

//		this.router.get('/download/', (req, res) => {
//	  		res.status(200);
//		});

		this.router.get('/downloads/:hash', async (req, res) => {
			const hashInfo = await redis.getHashInfo(req.params.hash);
			if (hashInfo) {
				const info = await redis.getVersionInfo(hashInfo.branch, hashInfo.version);
				res.render('download');
			} else
				res.render('error');
		});
	}
}

module.exports = StandardPages;
