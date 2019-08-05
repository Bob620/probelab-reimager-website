const Redis = require('ioredis');

const constants = require('./constants.json');
const fakeRedis = require('../../config/config.json').fakeRedis;

module.exports = class {
	constructor() {
		this.redis = fakeRedis ? require('./fakeredis.js') : new Redis(require('../../config/config.json').redis);

		if (fakeRedis)
			console.info('\nUsing a faked redis client for testing');
	}

	async getBranches() {
		return await this.redis.smembers(constants.redis.branches);
	}

	async getVersionInfo(branch, version) {
		const info = await this.redis.hgetall(`${constants.redis.branches}:${branch}:${version}`);
		return info ? info : {};
	}

	async getVersions(branch, major, minor) {
		let finalVersionList = await this.redis.smembers(`${constants.redis.branches}:${branch}`);

		if (major) {
			finalVersionList = finalVersionList.filter(version => version.startsWith(`${major}.`));
			if (minor)
				finalVersionList = finalVersionList.filter(version => version.startsWith(`${major}.${minor}`));
		}

		return finalVersionList ? finalVersionList : [];
	}

	async getLatestVersion(branch, major=undefined, minor=undefined) {
		let finalVersionList = await this.getVersions(branch, major, minor);

		return finalVersionList.reduce((best, current) => {
			current = current.split('.');

			if (current[0] > best[0])
				return current;
			if (current[0] < best[0])
				return best;

			if (current[1] > best[1])
				return current;
			if (current[1] < best[1])
				return best;

			if (current[2] > best[2])
				return current;
			if (current[2] < best[2])
				return best;

			return best;

		}, [0, 0, 0]).join('.');
	}
};