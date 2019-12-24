const Redis = require('ioredis');

const constants = require('./constants.json');
const fakeRedis = require('../../config/config.json').redis.fakeConnection;

module.exports = class {
	constructor() {
		this.redis = fakeRedis ? require('./fakeredis.js') : new Redis(require('../../config/config.json').redis);

		if (fakeRedis)
			console.info('\nUsing a faked redis client for testing');
	}

	async getChannels() {
		return await this.redis.smembers(constants.redis.channels);
	}

	async getVersionInfo(channel, version) {
		const info = await this.redis.hgetall(`${constants.redis.channels}:${channel}:${version}`);
		return info ? info : {};
	}

	async getVersions(channel, major, minor) {
		let finalVersionList = await this.redis.smembers(`${constants.redis.channels}:${channel}`);

		if (major) {
			finalVersionList = finalVersionList.filter(version => version.startsWith(`${major}.`));
			if (minor)
				finalVersionList = finalVersionList.filter(version => version.startsWith(`${major}.${minor}`));
		}

		return finalVersionList ? finalVersionList : [];
	}

	async getLatestVersion(channel, major=undefined, minor=undefined) {
		let finalVersionList = await this.getVersions(channel, major, minor);

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

	async getHashInfo(hash) {
		try {
			return {
				type: await this.redis.get(`${constants.redis.hashes}:${hash}:type`),
				channels: await Promise.all((await this.redis.smembers(`${constants.redis.hashes}:${hash}:channels`)).map(async channel => {
					return {
						channel,
						version: await this.redis.get(`${constants.redis.hashes}:${hash}:channels:${channel}`)
					};
				}))
			};
		} catch(err) {
			return {type: '', channels: []};
		}
	}

	async addDownload(hash) {
		hash = hash.toLowerCase();
		try {
			const info = await this.redis.hgetall(`${constants.redis.statistics}:${hash}`);
			await this.redis.hmset(`${constants.redis.statistics}:${hash}`,
				'totalDownloads', parseInt(info.totalDownloads) + 1);
		} catch(err) {
			const hashInfo = (await this.getHashInfo(hash)).channels[0];
			const info = await this.getVersionInfo(hashInfo.channel, hashInfo.version);
			await this.redis.sadd(`${constants.redis.statistics}`, hash);
			await this.redis.hmset(`${constants.redis.statistics}:${hash}`,
				'root', info.sha256,
				'totalDownloads', '1');
		}
	}

	async getStatistics(hash) {
		const info = await this.redis.smembers(`${constants.redis.statistics}:${hash}`);
		return info ? info : {};
	}
};