/* eslint-disable no-unused-vars */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';

import { describe, it, beforeEach, jest, expect } from '@jest/globals';
import { Service } from '../src/service.js';

describe('# STUBS #', () => {
	describe('# Service Suite', () => {
		let _service;
		const filename = 'testefile.ndjson';

		beforeEach(() => {
			_service = new Service({ filename });
		});

		describe('## Read', () => {
			it('should return an empty array if the file not exist', async () => {
				const result = await _service.read();
				expect(result).toStrictEqual([]);
			});

			it('should return an empty array if the file is empty', async () => {
				jest.spyOn(fs, 'readFile').mockResolvedValue('');

				const result = await _service.read();
				expect(result).toEqual([]);
			});

			it('should return users without password if file contains users', async () => {
				const dbData = [
					{username: 'user1', password: 'pass', createdAt: new Date().toISOString()},
					{username: 'user2', password: 'pass', createdAt: new Date().toISOString()}
				];

				const fileContents = dbData.map(item => JSON.stringify(item).concat('\n')).join('');

				jest.spyOn(fsSync, 'existsSync').mockResolvedValue(filename);
				jest.spyOn(fs, 'readFile').mockResolvedValue(fileContents);

				const result = await _service.read();

				const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));

				expect(result).toStrictEqual(expected);
			});
		});
	});	
});
