/**
 * Bob was here, and he made this
 */

const fs = require('fs');
const envify = require('envify/custom');
const uglifyjs = require('uglify-js');
const scssify = require('scssify');
const sass = require('sass');
const browserify = require('browserify');

const baseDir = "./src";
const outputDir = "./public";

/**
 * Builds the src directory
 */
function build(NODE_ENV = 'development') {
	process.env.NODE_ENV = NODE_ENV;

	if (!fs.existsSync(outputDir))
		fs.mkdirSync(outputDir);
	if (!fs.existsSync(`${outputDir}/js`))
		fs.mkdirSync(`${outputDir}/js`);
	if (!fs.existsSync(`${outputDir}/css`))
		fs.mkdirSync(`${outputDir}/css`);

	let entryFiles = [];
	for (const file of fs.readdirSync(baseDir, {withFileTypes: true})) {
		if (file.isFile()) {
			let name = file.name.split('.');
			const ext = name.pop();
			name = name.join('.');
			switch (ext) {
				case 'css':
				case 'scss':
					entryFiles.push({
						type: 'css',
						entry: `${baseDir}/${file.name}`,
						output: `${outputDir}/css/${name}.css`
					});
					break;
				case 'js':
				case 'jsx':
					entryFiles.push({
						type: 'js',
						entry: `${baseDir}/${file.name}`,
						output: `${outputDir}/js/${name}.js`
					});
					break;
			}
		}
	}

	if (process.env.NODE_ENV === 'production')
		console.log('Bundling production files...\n');
	else
		console.log('Bundling dev files...\n');

	let bundles = [];
	for (const {entry, output, type} of entryFiles) {
		console.log(`${entry} -> ${output}`);
		bundles.push(type === 'js' ? bundlejs([entry], output) : bundlecss(entry, output));
	}

	Promise.all(bundles).then(() => {
		console.log('\nAll files bundled');
	}).catch(err => {
		console.log(err);
	});
}

function bundlecss(file, outputName) {
	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV === 'production')
			resolve(fs.writeFileSync(outputName, sass.renderSync({
				file,
				outputStyle: 'compressed',
				outFile: outputName,
				includePaths: [baseDir]
			}).css));
		else
			resolve(fs.writeFileSync(outputName, sass.renderSync({
				file,
				outputStyle: 'expanded',
				outFile: outputName,
				includePaths: [baseDir]
			}).css));
	});
}

/**
 * Bundles files together into outputName.js
 * @param {Array} files array of the file urls
 * @param {string} outputName name of the output file (.js added automatically)
 * @example
 * bundle(["./src/index/index.jsx"], "index");
 */
function bundlejs(files, outputName) {
	if (process.env.NODE_ENV === 'production')
		return new Promise((resolve, reject) => {
			browserify()
			.transform(scssify)
			.transform(envify({NODE_ENV: 'production'}))
			.transform('uglifyify', {global: true})
			.add(files)
			.on('error', (err) => {
				console.log(err);
				reject(err);
			})
			.bundle()
			.pipe(fs.createWriteStream(outputName).on('close', () => {
				const test = uglifyjs.minify(fs.readFileSync(outputName, 'utf8'));
				fs.writeFile(outputName, test.code, () => {
					resolve();
				});
			}));
		});
	return new Promise((resolve, reject) => {
		browserify()
		.transform(scssify)
		.transform(envify())
		.add(files)
		.on('error', (err) => {
			console.log(err);
			reject(err);
		})
		.bundle()
		.pipe(fs.createWriteStream(outputName).on('close', () => {
			resolve();
		}));
	});
}

// Run the script
build(process.argv[2]);
