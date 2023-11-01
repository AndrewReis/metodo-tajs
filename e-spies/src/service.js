import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';

export class Service {
	#filename;

	constructor({ filename }) {
		this.#filename = filename;
	}

	#hashPassword(password) {
		const hash = crypto.createHash('sha256');
		hash.update(password);

		return hash.digest('hex');
	}

	async create({username, password}) {
		const data = JSON.stringify({
			username,
			password: this.#hashPassword(password),
			createdAt: new Date().toISOString()
		}).concat('\n');

		return fs.appendFile(this.#filename, data);
	}

	async read() {
		if (fsSync.existsSync(this.#filename)) {
			const lines = (await fs.readFile(this.#filename, 'utf-8')).split('\n').filter(line => !!line);

			if (!lines.length) return [];
			// eslint-disable-next-line no-unused-vars
			return lines.map(line => JSON.parse(line)).map(({password, ...rest}) => ({ ...rest }));
		}

		return [];
	}
}