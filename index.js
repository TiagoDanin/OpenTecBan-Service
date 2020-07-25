
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const api = require('./api')
const database = require('./database')

const port = process.env.PORT

let token = ''

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
			token = data.access_token

			api.accountAccessConsents(bankId, token)
				.then(response => {
					data = response.data
					const intentId = data.Data.ConsentId

					api.authCodeUrl(bankId, intentId)
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
