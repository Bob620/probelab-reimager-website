const express = require('express');

const Redis = require('./api/redis.js');

const constants = require('../config/config.json');

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

		this.router.get('/downloads/:channel/:hash', async (req, res) => {
			const hashInfo = await redis.getHashInfo(req.params.hash.toLowerCase());
			const channelInfo = hashInfo.channels.filter(({channel}) => {
				if (channel === req.params.channel)
					return true;
			});
			if (channelInfo[0]) {
				const info = await redis.getVersionInfo(channelInfo[0].channel, channelInfo[0].version);
				if (info) {
					info.channel = req.params.channel;
					info.downloadUrl = constants.downloadUrl;
					info.prefix = constants.downloadPrefix;
					res.render('download', info);
				}
				else
					res.render('error');
			} else
				res.render('error');
		});
	}
}

module.exports = StandardPages;
