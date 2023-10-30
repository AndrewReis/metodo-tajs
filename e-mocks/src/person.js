export default class Person {
	static validate(person) {
		if (!person.name) throw new Error('Name is required');
		if (!person.cpf) throw new Error('CPF is required');
	}

	static format(person) {
		const [name, ...lastName] = person.name.split(' ');

		return {
			cpf: person.cpf.replace(/\D/g, ''),
			name,
			lastName: lastName.join(' ')
		};
	}

	static save(person) {
		if (!['cpf', 'name', 'lastName'].every(prop => person[prop])) {
			throw new Error('cannot save invalid person: ', JSON.stringify(person));
		}

		console.log('save');
	}

	static process(person) {
		try {
			this.validate(person);
			const personFormatted = this.format(person);
			this.save(personFormatted);
			return 'ok';
		} catch (error) {
			throw new Error('Deu ruim');
		}
	}
}
