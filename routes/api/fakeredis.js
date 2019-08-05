const constants = require('./constants.json');

const dataset = {
	[constants.redis.branches]: ['dev', 'beta', 'stable'],
	[`${constants.redis.branches}:dev`]: ['1.0.0', '2.0.0', '3.0.0'],
	[`${constants.redis.branches}:beta`]: ['1.0.0', '1.0.1', '1.1.0', '1.1.2'],
	[`${constants.redis.branches}:dev:1.0.0`]: {
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
	[`${constants.redis.branches}:dev:2.0.0`]: {
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
	[`${constants.redis.branches}:dev:3.0.0`]: {
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
	[`${constants.redis.branches}:beta:1.0.0`]: {
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
	[`${constants.redis.branches}:beta:1.1.0`]: {
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
	[`${constants.redis.branches}:beta:1.0.1`]: {
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
	[`${constants.redis.branches}:beta:1.1.2`]: {
		version: '1.1.2',
		name: 'Some Beta',
		releaseDate: 1234567891011,
		description: 'This is the initial release of the beta version of Probelab Reimager',
		link: '',
		sha256: '',
		msiSHA256: '',
		nsisSHA256: '',
		available: true
	}
};

module.exports = {
	smembers: (location) => {
		return dataset[location];
	},
	hgetall: (location) => {
		return dataset[location];
	}
};