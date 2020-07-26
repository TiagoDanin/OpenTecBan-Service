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
	amount = Number(amount) + 0.0
	amount = amount.toString();

	const transaction = {
		id: uuidv4(),
		userId, amount, date, name
	}

	bicos.transactions.unshift(transaction)
	save()
	return transaction
}

const transactionGet = (userId) => {
	return bicos.transactions.filter(transaction => transaction.userId === userId)
}

const donePico = (id) => {
	const bicoSelect = bicos.request.find(bico => bico.id === id)
	bicos.request = bicos.request.filter(bico => bico.id !== id)
	bicos.done.push(bicoSelect)
	save()
}

module.exports = {
	bicos,
	donePico,
	addBico,
	hasBankWithCpf,
	addCpf,
	peddingBico,
	transactionAdd,
	transactionGet
}
