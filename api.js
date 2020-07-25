const axios = require('axios')
const qs = require('qs')
const https = require('https')
const fs = require('fs')
const {v4: uuidv4} = require('uuid')

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

const authCodeUrl = (bankId, id, type) => {
	const config = {
		method: 'get',
		url: `https://rs${bankId}.tecban-sandbox.o3bank.co.uk/ozone/v1.0/auth-code-url/${id}?scope=${type}&alg=none`,
		headers: {
			Authorization: `Basic ${basicToken(bankId)}`,
			Accept: '*/*'
		}
	}

	log(config)
	return client(bankId, config)
}

const domesticPaymentConsents = (bankId, token, amount) => {
	const data = JSON.stringify({
		Data: {
			Initiation: {
				InstructionIdentification: 'PMT.01234567890123456789.0124',
				EndToEndIdentification: 'TRX.01234567890.0124',
				InstructedAmount: {Amount: amount, Currency: 'BRL'},
				CreditorAccount: {
					SchemeName: 'BR.CPF',
					Identification: '12444678904',
					Name: 'Jaime Rodg'
				}
			}
		}, Risk: {}
	})

	const config = {
		method: 'post',
		url: `https://rs${bankId}.tecban-sandbox.o3bank.co.uk/open-banking/v3.1/pisp/domestic-payment-consents`,
		headers: {
			'Content-Type': 'application/json',
			'x-fapi-financial-id': 'c3c937c4-ab71-427f-9b59-4099b7c680ab',
			'x-fapi-customer-ip-address': '10.1.1.10',
			'x-fapi-interaction-id': uuidv4(),
			Authorization: `Bearer ${token}`
		},
		data
	}

	log(config)
	return client(bankId, config)
}

const tokenPayments = (bankId) => {
	const data = qs.stringify({
		'grant_type': 'client_credentials',
		'scope': 'payments openid' 
	})

	const config = {
		method: 'post',
		url: `https://as${bankId}.tecban-sandbox.o3bank.co.uk/token`,
		headers: { 
			'Content-Type': 'application/x-www-form-urlencoded', 
			'Authorization': `Basic ${basicToken(bankId)}`
		},
		data
	}

	log(config)
	return client(bankId, config)
}

const tokenConfirmPayment = (bankId, code) => {
	const data = qs.stringify({
		'grant_type': 'authorization_code',
		'scope': 'payments',
		'code': code,
		'redirect_uri': 'http://www.google.co.uk' 
	})

	const config = {
		method: 'post',
		url: `https://as${bankId}.tecban-sandbox.o3bank.co.uk/token`,
		headers: { 
			'Content-Type': 'application/x-www-form-urlencoded', 
			'Authorization': `Basic ${basicToken(bankId)}`
		},
		data
	}

	log(config)
	return client(bankId, config)
}

const domesticPayments = (bankId, token, intentId, initiation) => {
	console.log(initiation)
	const data = JSON.stringify({
		"Data": {
			"ConsentId": intentId,
			"Initiation":  JSON.parse(initiation)
		},
		"Risk": {}
	})

	const config = {
		method: 'post',
		url: `https://rs${bankId}.tecban-sandbox.o3bank.co.uk/open-banking/v3.1/pisp/domestic-payments`,
		headers: { 
			'Content-Type': 'application/json', 
			'x-fapi-financial-id': 'c3c937c4-ab71-427f-9b59-4099b7c680ab', 
			'x-fapi-customer-ip-address': '10.1.1.10', 
			'x-fapi-interaction-id': uuidv4(), 
			'Authorization': `Bearer ${token}`
		},
		data
	};

	log(config)
	return client(bankId, config)
}

module.exports = {
	token,
	tokenConfirmPayment,
	domesticPaymentConsents,
	domesticPayments,
	tokenPayments,
	accountAccessConsents,
	authCodeUrl
}
