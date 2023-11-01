import crypto from 'node:crypto';
import fs from 'node:fs/promises';

import { describe, it, beforeEach, jest, expect } from '@jest/globals';
import { Service } from '../src/service.js';

describe('# SPIES #', () => {
	describe('# Service Suite', () => {
		let _service;
		const MOCK_HASH_PASSWORD = 'hashedpassword';
		const filename = 'testefile.ndjson';

		beforeEach(() => {
			jest.spyOn(crypto, 'createHash').mockReturnValue({
				update: jest.fn().mockReturnThis(),
				digest: jest.fn().mockReturnValue(MOCK_HASH_PASSWORD)
			});

			jest.spyOn(fs, 'appendFile').mockResolvedValue();

			_service = new Service({ filename });
		});

		describe('## Create', () => {
			it('should call appendFile with right params', async () => {
				const expectedCreatedAt = new Date().toISOString();

				jest.spyOn(Date.prototype, Date.prototype.toISOString.name).mockReturnValue(expectedCreatedAt);

				const data = {
					username: 'user-1',
					password: 'pass'
				};

				await _service.create(data);

				// expect(crypto.createHash).toHaveBeenNthCalledWith(1, 'sha256');
				expect(crypto.createHash).toHaveBeenCalledWith('sha256');

				const hash = crypto.createHash('sha256');

				expect(hash.update).toHaveBeenCalledWith(data.password);
				expect(hash.digest).toHaveBeenCalledWith('hex');

				const expected = JSON.stringify({
					...data,
					createdAt: expectedCreatedAt,
					password: MOCK_HASH_PASSWORD
				}).concat('\n');

				expect(fs.appendFile).toHaveBeenCalledWith(filename, expected);
			});
		});
	});	
});
