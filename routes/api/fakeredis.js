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
		'58AA313217D891BB5E25A8CD7EB7CD97338A7A939A57708E0D2A26F8EB0B1266',
		'E03C0A334C0C792C3B48C4E1B9F033C1AEC8D5E8AE83D38E4EC64695E86F4273',
		'D0C20E90C037FDEB82338AFAE0999E7D9B7DF1B6D9AE6116A9933E73DDAF2005'
	],
	[`${constants.redis.hashes}:58AA313217D891BB5E25A8CD7EB7CD97338A7A939A57708E0D2A26F8EB0B1266`]: {
		type: '7z',
		version: '1.1.2',
		branch: 'beta'
	},
	[`${constants.redis.hashes}:E03C0A334C0C792C3B48C4E1B9F033C1AEC8D5E8AE83D38E4EC64695E86F4273`]: {
		type: 'msi',
		version: '1.1.2',
		branch: 'beta'
	},
	[`${constants.redis.hashes}:D0C20E90C037FDEB82338AFAE0999E7D9B7DF1B6D9AE6116A9933E73DDAF2005`]: {
		type: 'nsis',
		version: '1.1.2',
		branch: 'beta'
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