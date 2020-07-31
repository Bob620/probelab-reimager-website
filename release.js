#!/usr/bin/env node

const readline = require('readline');

const Redis = require('ioredis');
const redis = new Redis(require('./config/config.json').redis);

const constants = require('./routes/api/constants.json');

redis.smembers(constants.redis.channels).then(async channels => {
	console.log('Select Channel:');

	channels.push('Create New');
	let choices = {};
	for (let i = 0; i < channels.length; i++) {
		const channel = channels[i];
		console.log(`${i + 1}) ${channel}`);

		choices[i + 1] = channel;
		choices[channel] = channel;
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const question = text => new Promise(resolve => {
		rl.question(`> ${text}`, res => {
			resolve(res);
		});
	});

	const channelQuestion = await question('');

	const channel = choices[channelQuestion];
	if (channel === undefined) {
		console.log('Exiting...');
		return;
	}

	if (channel === 'Create New') {
		const channelName = await question('Name: ');

		console.log('Checking for collisions...');

		if (await redis.sismember(constants.redis.channels, channelName)) {
			console.warn('That channel already exists');
			return;
		}

		console.log('Creating channel...');
		await redis.sadd(constants.redis.channels, channelName);

		console.log('Channel Created');
	} else {
		console.log('Select Operation:');

		let operations = ['Create Release'];
		let choices = {};
		for (let i = 0; i < operations.length; i++) {
			const operation = operations[i];
			console.log(`${i + 1}) ${operation}`);

			choices[i + 1] = operation;
			choices[operation] = operation;
		}
		const operationQuestion = await question(`(${channel})`);
		const operation = choices[operationQuestion];

		switch(operation) {
			case 'Create Release':
				if (new Date().getDay() === 5) {
					const fridayDeath = await question('Are you sure you want to release on a Friday?(n) ');
					if (fridayDeath === '' || fridayDeath.startsWith('n'))
						return;
				}

				const releaseVersion = await question(`(${channel}) Version(major.minor.fix): `);
				const release7z = (await question(`(${channel}) 7z sha256: `)).toLowerCase();

				console.log('Remaining SHA are optional');
				const releaseMSI = (await question(`(${channel}) msi sha256: `)).toLowerCase();
				const releaseNSIS = (await question(`(${channel}) nsis sha256: `)).toLowerCase();
				const releaseDMG = (await question(`(${channel}) dmg sha256: `)).toLowerCase();
				const releaseSnap = (await question(`(${channel}) snap sha256: `)).toLowerCase();
				const releaseTargz = (await question(`(${channel}) tar.gz sha256: `)).toLowerCase();
				const releaseName = await question(`(${channel}) Name: `);
				const releaseDescription = await question(`(${channel}) Description: `);
				let releaseLink = await question(`(${channel}) Link(override): `);
				let releaseDate = await question(`(${channel}) Release Date in ms(override): `);
				releaseDate = releaseDate !== '' ? releaseDate : new Date().getTime();

				const isThisRight = await question('Is this info correct?(n) ');
				if (isThisRight === '' || isThisRight.startsWith('n'))
					return;

				console.log('Checking for collisions...');

				if (await redis.sismember(`${constants.redis.channels}:${channel}`, releaseVersion)) {
					console.warn(`That version is already released in this channel (${await redis.hget(`${constants.redis.channels}:${channel}:${releaseVersion}`, 'sha256')})`);
					return;
				}

				if (await redis.sismember(`${constants.redis.hashes}:${release7z}:channels`, channel)) {
					console.warn(`The 7z hash already exists in the channel (${await redis.get(`${constants.redis.hashes}:${release7z}:channels:${channel}`)})`);
					return;
				}

				if (releaseMSI !== '')
					if (await redis.sismember(`${constants.redis.hashes}:${releaseMSI}:channels`, channel)) {
						console.warn(`The msi hash already exists in the channel (${await redis.get(`${constants.redis.hashes}:${release7z}:channels:${channel}`)})`);
						return;
					}

				if (releaseNSIS !== '')
					if (await redis.sismember(`${constants.redis.hashes}:${releaseNSIS}:channels`, channel)) {
						console.warn(`The nsis hash already exists in the channel (${await redis.get(`${constants.redis.hashes}:${release7z}:channels:${channel}`)})`);
						return;
					}

				if (releaseDMG !== '')
					if (await redis.sismember(`${constants.redis.hashes}:${releaseDMG}:channels`, channel)) {
						console.warn(`The dmg hash already exists in the channel (${await redis.get(`${constants.redis.hashes}:${release7z}:channels:${channel}`)})`);
						return;
					}

				if (releaseSnap !== '')
					if (await redis.sismember(`${constants.redis.hashes}:${releaseSnap}:channels`, channel)) {
						console.warn(`The snap hash already exists in the channel (${await redis.get(`${constants.redis.hashes}:${release7z}:channels:${channel}`)})`);
						return;
					}

				if (releaseTargz !== '')
					if (await redis.sismember(`${constants.redis.hashes}:${releaseTargz}:channels`, channel)) {
						console.warn(`The tar.gz hash already exists in the channel (${await redis.get(`${constants.redis.hashes}:${release7z}:channels:${channel}`)})`);
						return;
					}

				console.log('Deploying...');

				await redis.sadd(`${constants.redis.channels}:${channel}`, releaseVersion);
				await redis.hmset(`${constants.redis.channels}:${channel}:${releaseVersion}`,
					'version', releaseVersion,
					'name', releaseName,
					'releaseDate', releaseDate,
					'description', releaseDescription,
					'link', releaseLink,
					'sha256', release7z,
					'msiSHA256', releaseMSI,
					'nsisSHA256', releaseNSIS,
					'dmgSHA256', releaseDMG,
					'snapSHA256', releaseSnap,
					'targzSHA256', releaseTargz,
					'available', true);

				await redis.sadd(constants.redis.hashes, release7z);
				await redis.sadd(constants.redis.hashes, releaseMSI);
				await redis.sadd(constants.redis.hashes, releaseNSIS);
				await redis.set(`${constants.redis.hashes}:${release7z}:type`, '7z');
				await redis.sadd(`${constants.redis.hashes}:${release7z}:channels`, channel);
				await redis.set(`${constants.redis.hashes}:${release7z}:channels:${channel}`, releaseVersion);
				await redis.set(`${constants.redis.hashes}:${releaseMSI}:type`, 'msi');
				await redis.sadd(`${constants.redis.hashes}:${releaseMSI}:channels`, channel);
				await redis.set(`${constants.redis.hashes}:${releaseMSI}:channels:${channel}`, releaseVersion);
				await redis.set(`${constants.redis.hashes}:${releaseNSIS}:type`, 'nsis');
				await redis.sadd(`${constants.redis.hashes}:${releaseNSIS}:channels`, channel);
				await redis.set(`${constants.redis.hashes}:${releaseNSIS}:channels:${channel}`, releaseVersion);
				await redis.set(`${constants.redis.hashes}:${releaseDMG}:type`, 'dmg');
				await redis.sadd(`${constants.redis.hashes}:${releaseDMG}:channels`, channel);
				await redis.set(`${constants.redis.hashes}:${releaseDMG}:channels:${channel}`, releaseVersion);
				await redis.set(`${constants.redis.hashes}:${releaseSnap}:type`, 'snap');
				await redis.sadd(`${constants.redis.hashes}:${releaseSnap}:channels`, channel);
				await redis.set(`${constants.redis.hashes}:${releaseSnap}:channels:${channel}`, releaseVersion);
				await redis.set(`${constants.redis.hashes}:${releaseTargz}:type`, 'targz');
				await redis.sadd(`${constants.redis.hashes}:${releaseTargz}:channels`, channel);
				await redis.set(`${constants.redis.hashes}:${releaseTargz}:channels:${channel}`, releaseVersion);

				console.log(`Deployed ${releaseVersion} to ${channel}`);
				break;
		}
	}
	process.exit();
}).catch(err => {
	console.warn(err);
});
