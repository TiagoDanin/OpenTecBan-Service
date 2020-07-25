const axios = require('axios')
const qs = require('qs')
const https = require('https')
const fs = require('fs')

const timeout = 1000

const httpsAgent01 = new https.Agent({
	rejectUnauthorized: false,
	cert: fs.readFileSync('./certs/client_certificate01.crt'),
	key: fs.readFileSync('./certs/client_private_key01.key')
})

const httpsAgent02 = new https.Agent({
	rejectUnauthorized: false,
	cert: fs.readFileSync('./certs/client_certificate02.crt'),
	key: fs.readFileSync('./certs/client_private_key02.key')
})

const client = (bankId, config) => bankId === '1' ? axios.create({timeout, httpsAgent: httpsAgent01})(config) : axios.create({timeout, httpsAgent: httpsAgent02})(config)

const basicToken = bankId => bankId === '1' ? process.env.BASIC_TOKEN01 : process.env.BASIC_TOKEN02

const log = config => {
	console.log('Request', config.url)
}

const token = bankId => {
	const data = qs.stringify({
		grant_type: 'client_credentials',
		scope: 'accounts openid'
	})

	const config = {
		method: 'post',
		url: `https://as${bankId}.tecban-sandbox.o3bank.co.uk/token`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${basicToken(bankId)}`
		},
		data
	}

	log(config)
	return client(bankId, config)
}

const accountAccessConsents = (bankId, token) => {
	const data = JSON.stringify({Data: {Permissions: ['ReadAccountsBasic', 'ReadAccountsDetail', 'ReadBalances', 'ReadBeneficiariesBasic', 'ReadBeneficiariesDetail', 'ReadDirectDebits', 'ReadTransactionsBasic', 'ReadTransactionsCredits', 'ReadTransactionsDebits', 'ReadTransactionsDetail', 'ReadProducts', 'ReadStandingOrdersDetail', 'ReadProducts', 'ReadStandingOrdersDetail', 'ReadStatementsDetail', 'ReadParty', 'ReadOffers', 'ReadScheduledPaymentsBasic', 'ReadScheduledPaymentsDetail', 'ReadPartyPSU']}, Risk: {}})

	const config = {
		method: 'post',
		url: `https://rs${bankId}.tecban-sandbox.o3bank.co.uk/open-banking/v3.1/aisp/account-access-consents`,
		headers: {
			'Content-Type': 'application/json',
			'x-fapi-financial-id': 'c3c937c4-ab71-427f-9b59-4099b7c680ab',
			'x-fapi-interaction-id': '3588e5a6-20df-477a-9abe-1c3979e1f1fb',
			Authorization: `Bearer ${token}`
		},
		data
	}

	log(config)
	return client(bankId, config)
}

const authCodeUrl = (bankId, id) => {
	const config = {
		method: 'get',
		url: `https://rs${bankId}.tecban-sandbox.o3bank.co.uk/ozone/v1.0/auth-code-url/${id}?scope=accounts&alg=none`,
		headers: {
			Authorization: `Basic ${basicToken(bankId)}`,
			Accept: '*/*'
		},
		data: null
	}

	log(config)
	return client(bankId, config)
}

module.exports = {
	token,
	accountAccessConsents,
	authCodeUrl
}
