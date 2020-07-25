
const express = require('express')
const app = express()
const api = require('./api')

const port = process.env.PORT

let token = ''

app.get('/', (request, responseExpress) => responseExpress.send('Hello World!'))

app.get('/api', (request, responseExpress) => responseExpress.json({isOk: true}))

app.get('/startAuthentication', (request, responseExpress) => {
	let url = ''
	let isOk = false

	const error = errorLog => {
		console.error(errorLog)
		responseExpress.json({isOk, url})
	}

	api.token()
		.then(response => {
			let data = response.data
			token = data.access_token

			api.accountAccessConsents(token)
				.then(response => {
					data = response.data
					const intentId = data.Data.ConsentId

					api.authCodeUrl(intentId)
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
