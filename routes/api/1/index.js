const express = require('express');

const Redis = require('../redis.js');

const router = express.Router();
const redis = new Redis();

router.get('/channels/:channel', async (req, res) => {
	res.status(200);
	res.json({
		versions: (await Promise.all((await redis.getVersions(req.params.channel)).map(version => redis.getVersionInfo(req.params.channel, version))))
		.reduce((all, info) => {
			all[info.version] = info;
			return all;
		}, {})
	});
	res.end();
});

router.get('/channels/:channel/latest', async (req, res) => {
	res.status(200);
	res.json(await redis.getVersionInfo(req.params.channel, await redis.getLatestVersion(req.params.channel)));
	res.end();
});

router.get('/channels/:channel/:major', async (req, res) => {
	res.status(200);
	res.json({
		versions: (await Promise.all((await redis.getVersions(req.params.channel, req.params.major)).map(version => redis.getVersionInfo(req.params.channel, version))))
		.reduce((all, info) => {
			all[info.version] = info;
			return all;
		}, {})
	});
	res.end();
});

router.get('/channels/:channel/:major/latest', async (req, res) => {
	res.status(200);
	res.json(await redis.getVersionInfo(req.params.channel, await redis.getLatestVersion(req.params.channel, req.params.major)));
	res.end();
});

router.get('/channels/:channel/:major/:minor', async (req, res) => {
	res.status(200);
	res.json({
		versions: (await Promise.all((await redis.getVersions(req.params.channel, req.params.major, req.params.minor)).map(version => redis.getVersionInfo(req.params.channel, version))))
		.reduce((all, info) => {
			all[info.version] = info;
			return all;
		}, {})
	});
	res.end();
});

router.get('/channels/:channel/:major/:minor/latest', async (req, res) => {
	res.status(200);
	res.json(await redis.getVersionInfo(req.params.channel, await redis.getLatestVersion(req.params.channel, req.params.major, req.params.minor)));
	res.end();
});

module.exports = router;