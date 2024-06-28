const fs = require('node:fs');
const system = process.platform
const cproc = require('node:child_process')
const crypto = require('node:crypto');
const { PassThrough } = require('node:stream')

let path = ""

process.on('beforeExit', () => {
	let files = fs.readdirSync(`${__dirname}/temp/`);

	for (file of files) {
		fs.unlinkSync(`${__dirname}/temp/${file}`);
	}

})

if (system == "win32") {
	path = __dirname+"\\yt-dlp.exe";
} else if (system == "linux") {
	path == __dirname+"/yt-dlp_linux"
}

module.exports = (url) => {
	return new Promise((res,rej) => {
		let random = (Math.random() + 1).toString(36).substring(7);

		let args = `-f bestaudio -x --audio-format mp3 -o "${__dirname}/temp/${random}.%(ext)s" "${url}"`

		cproc.execSync(`${path} ${args}`, {windowsHide: true});

		let stream = fs.createReadStream(`${__dirname}/temp/${random}.mp3`)

		res(stream);

		stream.on('end', () => {
			fs.unlinkSync(`${__dirname}/temp/${random}.mp3`)
		})

	})
}