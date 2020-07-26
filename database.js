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

const peddingBico = (userId) => {
	return bicos.request.filter(bico => bico.userId === userId)
}

const transactionAdd = (userId, amount, date, name) => {
	const transaction = {
		id: uuidv4(),
		userId, amount, date, name
	}

	bicos.transaction.push(transaction)
	save()
	return transaction
}

const transactionGet = (userId) => {
	return bicos.transactions.filter(transaction => transaction.userId === userId)
}

module.exports = {
	bicos,
	addBico,
	hasBankWithCpf,
	addCpf,
	peddingBico,
	transactionAdd,
	transactionGet
}
