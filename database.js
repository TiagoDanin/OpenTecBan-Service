const jsonfile = require('jsonfile')
const {v4: uuidv4} = require('uuid')

const file = 'data.json'
const bicos = jsonfile.readFileSync(file)

const save = () => {
	jsonfile.writeFileSync(file, bicos, {
		replacer: true,
		spaces: '\t'
	})
}

const addBico = (name, photo, description, type) => {
	const user = {
		id: uuidv4(),
		name, photo, description, type
	}

	bicos.list.push(user)
	save()
	return user
}

const hasBankWithCpf = (cpf) => {
	return bicos.banksCpf.includes(cpf)
}

const addCpf = (cpf) => {
	bicos.banksCpf.push(cpf)
	save()
}

module.exports = {
	bicos,
	addBico,
	hasBankWithCpf,
	addCpf
}
