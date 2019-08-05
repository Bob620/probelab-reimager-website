const express = require('express');

const Redis = require('../redis.js');

const router = express.Router();
const redis = new Redis();

router.get('/branches/:branch', async (req, res) => {
	res.status(200);
	res.json({
		versions: (await Promise.all((await redis.getVersions(req.params.branch)).map(version => redis.getVersionInfo(req.params.branch, version))))
		.reduce((all, info) => {
			all[info.version] = info;
			return all;
		}, {})
	});
	res.end();
});

router.get('/branches/:branch/latest', async (req, res) => {
	res.status(200);
	res.json(await redis.getVersionInfo(req.params.branch, await redis.getLatestVersion(req.params.branch)));
	res.end();
});

router.get('/branches/:branch/:major', async (req, res) => {
	res.status(200);
	res.json({
		versions: (await Promise.all((await redis.getVersions(req.params.branch, req.params.major)).map(version => redis.getVersionInfo(req.params.branch, version))))
		.reduce((all, info) => {
			all[info.version] = info;
			return all;
		}, {})
	});
	res.end();
});

router.get('/branches/:branch/:major/latest', async (req, res) => {
	res.status(200);
	res.json(await redis.getVersionInfo(req.params.branch, await redis.getLatestVersion(req.params.branch, req.params.major)));
	res.end();
});

router.get('/branches/:branch/:major/:minor', async (req, res) => {
	res.status(200);
	res.json({
		versions: (await Promise.all((await redis.getVersions(req.params.branch, req.params.major, req.params.minor)).map(version => redis.getVersionInfo(req.params.branch, version))))
		.reduce((all, info) => {
			all[info.version] = info;
			return all;
		}, {})
	});
	res.end();
});

router.get('/branches/:branch/:major/:minor/latest', async (req, res) => {
	res.status(200);
	res.json(await redis.getVersionInfo(req.params.branch, await redis.getLatestVersion(req.params.branch, req.params.major, req.params.minor)));
	res.end();
});

module.exports = router;