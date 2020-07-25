
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const api = require('./api')
const database = require('./database')

const port = process.env.PORT

app.use(bodyParser.urlencoded({
	extended: false
}))

app.get('/', (request, responseExpress) => responseExpress.send('Hello World!'))

app.get('/api', (request, responseExpress) => responseExpress.json({isOk: true}))

app.get('/startAuthentication/:id', (request, responseExpress) => {
	const bankId = request.params.id
	let url = ''
	let isOk = false

	const error = errorLog => {
		console.error(errorLog)
		responseExpress.json({isOk, url})
	}

	api.token(bankId)
		.then(response => {
			let data = response.data
			const token = data.access_token
			console.log(token)
			api.accountAccessConsents(bankId, token)
				.then(response => {
					data = response.data
					const intentId = data.Data.ConsentId

					api.authCodeUrl(bankId, intentId, 'accounts')
						.then(response => {
							url = response.data
							isOk = true
							responseExpress.json({isOk, url})
						})
						.catch(error)
				})
				.catch(error)
		})
		.catch(error)
})

app.post('/startPayment/:id', (request, responseExpress) => {
	const bankId = request.params.id
	let url = ''
	let isOk = false

	const error = errorLog => {
		console.error(errorLog)
		responseExpress.json({isOk, url, intentId: '', initiation: ''})
	}

	api.tokenPayments(bankId)
		.then(response => {
			let data = response.data
			const token = data.access_token

			api.domesticPaymentConsents(bankId, token, request.body.amount)
				.then(response => {
					data = response.data
					const intentId = data.Data.ConsentId
					const initiation = data.Data.Initiation

					api.authCodeUrl(bankId, intentId, 'payments')
						.then(response => {
							url = response.data
							isOk = true
							responseExpress.json({isOk, url, intentId, initiation: JSON.stringify(initiation)})
						})
						.catch(error)
				})
				.catch(error)
		})
		.catch(error)
})

app.post('/confirmPayment/:id', (request, responseExpress) => {
	const bankId = request.params.id
	let isOk = false

	const error = errorLog => {
		console.error(errorLog)
		responseExpress.json({isOk})
	}

	api.tokenConfirmPayment(bankId, request.body.code)
		.then(response => {
			let data = response.data
			const token = data.access_token

			api.domesticPayments(bankId, token, request.body.intentId, request.body.initiation)
				.then(response => {
					isOk = response.Data.Status === 'AcceptedSettlementCompleted'
					responseExpress.json({isOk})
				})
				.catch(error)
		})
		.catch(error)
})

app.get('/bicos/all', (request, responseExpress) => {
	responseExpress.json({isOk: true, list: database.bicos.list})
})

app.get('/bicos/:id', (request, responseExpress) => {
	const id = request.params.id
	const list = database.bicos.list.filter(bico => bico.id === id)

	responseExpress.json({isOk: true, list})
})

app.post('/bicos/add', (request, responseExpress) => {
	const user = database.addBico(request.body.name, request.body.photo, request.body.description)

	responseExpress.json({isOk: true, user, list: database.bicos.list})
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
