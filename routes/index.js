const express = require('express');

const Redis = require('./api/redis.js');

const constants = require('../config/config.json');
const defaultRender = {
	download: constants.download,
	source: constants.source
};

class StandardPages {
	constructor() {
		const redis = new Redis();
		this.router = express.Router();

		/* GET landing page. */
		this.router.get('/', (req, res) => {
			res.render('index', defaultRender);
		});

		this.router.get('/about/', (req, res) => {
			res.render('about', defaultRender);
		});

		this.router.get('/manual/', (req, res) => {
			res.render('manual', defaultRender);
		});

		this.router.get('/download/', async (req, res, next) => {
			const channel = constants.download.defaultChannel;
			let info = await redis.getVersionInfo(channel, await redis.getLatestVersion(channel));
			if (info) {
				info.hash = info.sha256;
				info.channel = channel;
				info.download = defaultRender.download;
				info.source = defaultRender.source;
				res.render('download', info);
			} else
				next();
		});

		this.router.get('/download/:hash/:installer', async (req, res, next) => {
			try {
				const hash = req.params.hash.toLowerCase();
				const info = await redis.getHashInfo(hash);
				if (info) {
					res.redirect(307, `${constants.download.url}/${req.params.installer}`);
					await redis.addDownload(hash);
				} else
					next();
			} catch (err) {
				next();
			}
		});

		this.router.get('/downloads/:channel/:hash', async (req, res, next) => {
			const hashInfo = await redis.getHashInfo(req.params.hash.toLowerCase());
			const channelInfo = hashInfo.channels.filter(({channel}) => {
				if (channel === req.params.channel)
					return true;
			});

			if (channelInfo[0]) {
				let info = await redis.getVersionInfo(channelInfo[0].channel, channelInfo[0].version);
				if (info) {
					info.hash = info.sha256;
					info.channel = req.params.channel;
					info.download = defaultRender.download;
					info.source = defaultRender.source;
					res.render('download', info);
				} else
					next();
			} else
				next();
		});

		// error handler
		this.router.use(function(req, res) {
			// render the error page
			res.status(500);
			const render = JSON.parse(JSON.stringify(defaultRender));
//			render.status = err.status;

			res.render('error', render);
		});
	}
}

module.exports = StandardPages;
