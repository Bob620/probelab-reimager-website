const constants = require('./constants.json');

const dataset = {
	[constants.redis.channels]: ['dev', 'beta', 'stable'],
	[`${constants.redis.channels}:dev`]: ['1.0.0', '2.0.0', '3.0.0'],
	[`${constants.redis.channels}:beta`]: ['1.0.0', '1.0.1', '1.1.0', '1.1.2'],
	[`${constants.redis.channels}:dev:1.0.0`]: {
		version: '1.0.0',
		name: 'Some Dev',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	},
	[`${constants.redis.channels}:dev:2.0.0`]: {
		version: '2.0.0',
		name: 'Some Dev',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	},
	[`${constants.redis.channels}:dev:3.0.0`]: {
		version: '3.0.0',
		name: 'Some Dev',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	},
	[`${constants.redis.channels}:beta:1.0.0`]: {
		version: '1.0.0',
		name: 'Some Beta',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: false
	},
	[`${constants.redis.channels}:beta:1.1.0`]: {
		version: '1.1.0',
		name: 'Some Beta',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	},
	[`${constants.redis.channels}:beta:1.0.1`]: {
		version: '1.0.1',
		name: 'Some Beta',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	},
	[`${constants.redis.channels}:beta:1.1.2`]: {
		version: '1.1.2',
		name: 'Some Beta',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	},
	[`${constants.redis.hashes}`]: [
		'58aa313217d891bb5e25a8cd7eb7cd97338a7a939a57708e0d2a26f8eb0b1266',
		'e03c0a334c0c792c3b48c4e1b9f033c1aec8d5e8ae83d38e4ec64695e86f4273',
		'd0c20e90c037fdeb82338afae0999e7d9b7df1b6d9ae6116a9933e73ddaf2005'
	],
	[`${constants.redis.hashes}:58aa313217d891bb5e25a8cd7eb7cd97338a7a939a57708e0d2a26f8eb0b1266:type`]: '7z',
	[`${constants.redis.hashes}:58aa313217d891bb5e25a8cd7eb7cd97338a7a939a57708e0d2a26f8eb0b1266:channels`]: ['beta'],
	[`${constants.redis.hashes}:58aa313217d891bb5e25a8cd7eb7cd97338a7a939a57708e0d2a26f8eb0b1266:channels:beta`]: '1.1.2',
	[`${constants.redis.hashes}:e03c0a334c0c792c3b48c4e1b9f033c1aec8d5e8ae83d38e4ec64695e86f4273:type`]: 'msi',
	[`${constants.redis.hashes}:e03c0a334c0c792c3b48c4e1b9f033c1aec8d5e8ae83d38e4ec64695e86f4273:channels`]: ['beta'],
	[`${constants.redis.hashes}:e03c0a334c0c792c3b48c4e1b9f033c1aec8d5e8ae83d38e4ec64695e86f4273:channels:beta`]: '1.1.2',
	[`${constants.redis.hashes}:d0c20e90c037fdeb82338afae0999e7d9b7df1b6d9ae6116a9933e73ddaf2005:type`]: 'nsis',
	[`${constants.redis.hashes}:d0c20e90c037fdeb82338afae0999e7d9b7df1b6d9ae6116a9933e73ddaf2005:channels`]: ['beta'],
	[`${constants.redis.hashes}:d0c20e90c037fdeb82338afae0999e7d9b7df1b6d9ae6116a9933e73ddaf2005:channels:beta`]: '1.1.2',
};

module.exports = {
	smembers: (location) => {
		return dataset[location];
	},
	hgetall: (location) => {
		return dataset[location];
	},
	get: (location) => {
		return dataset[location];
	}
};