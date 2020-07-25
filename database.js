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

const addBico = (name, photo, description) => {
	const user = {
		id: uuidv4(),
		name, photo, description
	}

	bicos.list.push(user)
	save()
	return user
}

module.exports = {
	bicos,
	addBico
}
