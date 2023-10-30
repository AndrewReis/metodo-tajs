import { describe, it, jest, expect } from '@jest/globals';
import Person from '../src/person';

describe('# Person Suite', () => {
	describe('## Validate', () => {
		it('should throw if the name is not present', () => {
			// mock é a entrada necessaria para que o teste funcione
			const mockInvalidPerson = {
				name: '',
				cpf: '123.456.789-00'
			};

			const result = () => Person.validate(mockInvalidPerson);
			expect(result).toThrow(new Error('Name is required'));
		});

		it('should throw if the cpf is not present', () => {
			const mockInvalidPerson = {
				name: 'Fulano',
				cpf: ''
			};

			const result = () => Person.validate(mockInvalidPerson);
			expect(result).toThrow(new Error('CPF is required'));
		});

		it('should not throw if person is valid', () => {
			const mockInvalidPerson = {
				name: 'Fulano',
				cpf: '123.456.789-00'
			};

			const result = () => Person.validate(mockInvalidPerson);
			expect(result).not.toThrow();
		});
	});

	describe('## Format', () => {
		it('should format the person name and CPF', () => {
			// AAA
			// Arrange = Preparar
			const mockPerson = {
				name: 'Fulano da Silva',
				cpf: '123.456.789-00'
			};
			// Act = Executar
			const formattedPerson = Person.format(mockPerson);
			// Assert = Validar
			const expected = {
				name: 'Fulano',
				cpf: '12345678900',
				lastName: 'da Silva'
			};

			expect(formattedPerson).toStrictEqual(expected);
		});
	});

	describe('## Save', () => {
		it('should not save the person if the name is not present', () => {
			const mockPerson = {
				name: '',
				lastName: 'da Silva',
				cpf: '123.456.789-00'
			};

			const result = () => Person.save(mockPerson);
			expect(result).toThrow(new Error('cannot save invalid person: ', JSON.stringify(mockPerson)));
		});

		it('should not save the person if the lastName is not present', () => {
			const mockPerson = {
				name: 'Fulano',
				lastName: '',
				cpf: '123.456.789-00'
			};

			const result = () => Person.save(mockPerson);
			expect(result).toThrow(new Error('cannot save invalid person: ', JSON.stringify(mockPerson)));
		});

		it('should not save the person if the CPF is not present', () => {
			const mockPerson = {
				name: 'Fulano',
				lastName: 'da Silva',
				cpf: ''
			};

			const result = () => Person.save(mockPerson);
			expect(result).toThrow(new Error('cannot save invalid person: ', JSON.stringify(mockPerson)));
		});
	});

	describe('## Process', () => {
		it('should process a valid person', () => {
			// Não testar o que já foi testado
			jest.spyOn(Person, Person.validate.name).mockReturnValue();

			const mockPerson = {
				name: 'Fulano',
				cpf: '123.456.789-00'
			};

			jest.spyOn(Person, Person.format.name).mockReturnValue({ cpf: '12345678900', name: 'Fulano', lastName: '12345678900' });

			const result = Person.process(mockPerson);

			const expected = 'ok';
			expect(result).toStrictEqual(expected);
		});

		it('should not process the person if throw', () => {
			jest.spyOn(Person, 'validate').mockImplementation(() => {
				throw new Error('Name is required');
			});

			const mockPerson = {
				name: 'Fulano',
				cpf: '123.456.789-00'
			};

			const result = () => Person.process(mockPerson);

			expect(result).toThrow(new Error('Deu ruim'));
		});
	});
});
