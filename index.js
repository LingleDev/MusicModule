const fs = require('node:fs');
const system = process.platform
const cproc = require('node:child_process')
const crypto = require('node:crypto');
const { PassThrough } = require('node:stream')

let path = ""

module.exports = (url, xargs) => {
	return new Promise((res,rej) => {

		process.on('beforeExit', () => {
			let files = fs.readdirSync(`${__dirname}/temp/`);
		
			for (file of files) {
				fs.unlinkSync(`${__dirname}/temp/${file}`);
			}
		
		})
		
		let random = (Math.random() + 1).toString(36).substring(7);

		let args = xargs.join(" ") + ` -f bestaudio -x --audio-format mp3 -o "${__dirname}/temp/${random}.%(ext)s" "${url}"`

		cproc.execSync(`yt-dlp ${args}`, {windowsHide: true});

		let stream = fs.createReadStream(`${__dirname}/temp/${random}.mp3`)
		
		res(stream.pipe(new PassThrough()));

		stream.on('end', () => {
			fs.unlinkSync(`${__dirname}/temp/${random}.mp3`)
		})

	})
}