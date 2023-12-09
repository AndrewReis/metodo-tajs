import { describe, beforeEach, it, jest, expect } from '@jest/globals';
import { setTimeout } from 'node:timers/promises';

import Task from '../src/task.js';

describe('# Fake Timers #', () => {
	// eslint-disable-next-line no-unused-vars
	let _logMock;
	let _task;

	beforeEach(() => {
		_logMock = jest.spyOn(console, console.log.name).mockImplementation();
		_task = new Task();
	});

	it.skip('should only run tasks that are due without fake timers (slow)', async () => {
		/// AAA
		// Arrange
		const tasks = [
			{
				name: 'Task-will-run-in-5-secs',
				dueAt: new Date(Date.now() + 5000),
				fn: jest.fn()
			},
			{
				name: 'Task-will-run-in-10-secs',
				dueAt: new Date(Date.now() + 10000),
				fn: jest.fn()
			}
		];

		// act
		_task.save(tasks.at(0));
		_task.save(tasks.at(1));

		_task.run(200);

		// 11e3 -> 11_0000
		await setTimeout(11e3);

		expect(tasks.at(0).fn).toHaveBeenCalled();
		expect(tasks.at(1).fn).toHaveBeenCalled();
	}, 15e3);

	it.skip('should only run tasks that are due without fake timers (fast)', async () => {
		jest.useFakeTimers();
		/// AAA
		// Arrange
		const tasks = [
			{
				name: 'Task-will-run-in-5-secs',
				dueAt: new Date(Date.now() + 5000),
				fn: jest.fn()
			},
			{
				name: 'Task-will-run-in-10-secs',
				dueAt: new Date(Date.now() + 10000),
				fn: jest.fn()
			}
		];

		// act
		_task.save(tasks.at(0));
		_task.save(tasks.at(1));

		_task.run(200);

		// ninguem deve ser executado
		jest.advanceTimersByTime(4000);
		expect(tasks.at(0).fn).not.toHaveBeenCalled();
		expect(tasks.at(1).fn).not.toHaveBeenCalled();

		// 4s + 2s = 6s apenas a primeira task deve ser executada
		jest.advanceTimersByTime(2000);
		expect(tasks.at(0).fn).toHaveBeenCalled();
		expect(tasks.at(1).fn).not.toHaveBeenCalled();

		// 4s + 2s + 4s = 10s a segunda task deve ser executada
		jest.advanceTimersByTime(4000);
		expect(tasks.at(0).fn).toHaveBeenCalled();
		expect(tasks.at(1).fn).toHaveBeenCalled();


		jest.useRealTimers();
	});
});
