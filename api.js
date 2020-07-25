const axios = require('axios')
const qs = require('qs')
const https = require('https')
const fs = require('fs')

const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
	cert: fs.readFileSync('./client_certificate.crt'),
	key: fs.readFileSync('./client_private_key.key')
})

const client = axios.create({
	timeout: 1000,
	httpsAgent
})

const log = config => {
	console.log('Request', config.url)
}

const basicToken = process.env.BASIC_TOKEN

const token = () => {
	const data = qs.stringify({
		grant_type: 'client_credentials',
		scope: 'accounts openid'
	})

	const config = {
		method: 'post',
		url: 'https://as2.tecban-sandbox.o3bank.co.uk/token',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${basicToken}`
		},
		data
	}

	log(config)
	return client(config)
}

const accountAccessConsents = token => {
	const data = JSON.stringify({Data: {Permissions: ['ReadAccountsBasic', 'ReadAccountsDetail', 'ReadBalances', 'ReadBeneficiariesBasic', 'ReadBeneficiariesDetail', 'ReadDirectDebits', 'ReadTransactionsBasic', 'ReadTransactionsCredits', 'ReadTransactionsDebits', 'ReadTransactionsDetail', 'ReadProducts', 'ReadStandingOrdersDetail', 'ReadProducts', 'ReadStandingOrdersDetail', 'ReadStatementsDetail', 'ReadParty', 'ReadOffers', 'ReadScheduledPaymentsBasic', 'ReadScheduledPaymentsDetail', 'ReadPartyPSU']}, Risk: {}})

	const config = {
		method: 'post',
		url: 'https://rs2.tecban-sandbox.o3bank.co.uk/open-banking/v3.1/aisp/account-access-consents',
		headers: {
			'Content-Type': 'application/json',
			'x-fapi-financial-id': 'c3c937c4-ab71-427f-9b59-4099b7c680ab',
			'x-fapi-interaction-id': '3588e5a6-20df-477a-9abe-1c3979e1f1fb',
			Authorization: `Bearer ${token}`
		},
		data
	}

	log(config)
	return client(config)
}

const authCodeUrl = id => {
	const config = {
		method: 'get',
		url: `https://rs2.tecban-sandbox.o3bank.co.uk/ozone/v1.0/auth-code-url/${id}?scope=accounts&alg=none`,
		headers: {
			Authorization: `Basic ${basicToken}`,
			Accept: '*/*'
		},
		data: null
	}

	log(config)
	return client(config)
}

module.exports = {
	token,
	accountAccessConsents,
	authCodeUrl
}
