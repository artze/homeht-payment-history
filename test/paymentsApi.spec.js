const expect = require('chai').expect
const request = require('request-promise-native')
const db = require('../db')
const Contract = require('../db/models/Contract')
const Payment = require('../db/models/Payment')
const domainUrl = require('./config').domainUrl
const paymentData = require('./fixtures/paymentData')
const contractData = require('./fixtures/contractData')

before('Create DB connection', async function() {
    await db.init()
})

describe('Test payments API endpoints', function() {
    let contractDbObj
    let paymentDbObjArr

    before('Create Contract and Payment dummy data', async function() {
        contractDbObj = await Contract.create(contractData.single)
        
        const paymentDataArrWithUpdatedContractId = paymentData.multiple.map(function(payment) {
            return {
                ...payment,
                contractId: contractDbObj.id
            }
        })
        paymentDbObjArr = await Payment.insertMany(paymentDataArrWithUpdatedContractId)
    })

    describe('Fetch payments with filters in query string with GET', function() {
        const queryString = 'startDate=2018-02-01&endDate=2018-02-28'

        it('Should return response code 200', async function() {
            const response = await request({
                method: 'GET',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments?${queryString}`,
                json: true,
                resolveWithFullResponse: true
            })
            expect(response.statusCode).to.equal(200)
        })

        it('Should return correct list of payments', async function() {
            const response = await request({
                method: 'GET',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments?${queryString}`,
                json: true,
                resolveWithFullResponse: true
            })
            expect(response.body.items.length).to.equal(2)
        })
    })

    describe('Fetch payments using incorrect query string with GET', function() {
        const queryString = 'startDate=2018-02-01&endDate=20181212'

        it('Should return response code 400', async function() {
            const response = await request({
                method: 'GET',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments?${queryString}`,
                json: true,
                resolveWithFullResponse: true,
                simple: false
            })
            expect(response.statusCode).to.equal(400)
        })
    })

    describe('Fetch payments using invalid contractId with GET', function() {
        const queryString = 'startDate=2018-02-01&endDate=2018-02-28'
        
        it('Should return response code 404', async function() {
            const response = await request({
                method: 'GET',
                url: `${domainUrl}/contracts/12345/payments?${queryString}`,
                json: true,
                resolveWithFullResponse: true,
                simple: false
            })
            expect(response.statusCode).to.equal(404)
        })
    })

    describe('Create payment entity with POST', function() {
        const paymentDataForCreation = Object.assign({}, paymentData.single)
        delete paymentDataForCreation.contractId

        it('Should return response code 201', async function() {
            const response = await request({
                method: 'POST',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments`,
                resolveWithFullResponse: true,
                json: true,
                body: paymentDataForCreation
            })
            expect(response.statusCode).to.equal(201)
        })

        it('Should create payment entity in database', async function() {
            const response = await request({
                method: 'POST',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments`,
                resolveWithFullResponse: true,
                json: true,
                body: paymentDataForCreation
            })
            const retrievedPayment = await Payment.findById(response.body.id)
            expect(retrievedPayment.description).to.equal('database test')
            expect(retrievedPayment.contractId.toString()).to.equal(contractDbObj.id)
        })
    })

    describe('Create payment entity using invalid data types with POST', function() {
        const paymentDataForCreation = Object.assign({}, paymentData.single)
        delete paymentDataForCreation.contractId
        paymentDataForCreation.value = '300'

        it('Should return response code 400', async function() {
            const response = await request({
                method: 'POST',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments`,
                resolveWithFullResponse: true,
                json: true,
                body: paymentDataForCreation,
                simple: false
            })
            expect(response.statusCode).to.equal(400)
        })
    })

    describe('Create payment entity using invalid contractId with POST', function() {
        const paymentDataForCreation = Object.assign({}, paymentData.single)
        delete paymentDataForCreation.contractId

        it('Should return response code 404', async function() {
            const response = await request({
                method: 'POST',
                url: `${domainUrl}/contracts/12345/payments`,
                resolveWithFullResponse: true,
                json: true,
                body: paymentDataForCreation,
                simple: false
            })
            expect(response.statusCode).to.equal(404)
        })
    })

    describe('Update payment entity with PATCH', function() {
        let targetPaymentId
        const newPaymentValues = {
            value: 98765,
            time: new Date('2000-01-01').toISOString()
        }

        it('Should return response code 200', async function() {
            targetPaymentId = paymentDbObjArr[0].id
            const response = await request({
                method: 'PATCH',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments/${targetPaymentId}`,
                resolveWithFullResponse: true,
                json: true,
                body: newPaymentValues
            })
            expect(response.statusCode).to.equal(200)
        })

        it('Should update payment entity', async function() {
            const retrievedPayment = await Payment.findById(targetPaymentId)
            expect(retrievedPayment.value).to.equal(newPaymentValues.value)
            expect(retrievedPayment.time.toISOString()).to.equal(newPaymentValues.time)
        })
    })

    describe('Update payment entity using invalid data types with PATCH', function() {
        let targetPaymentId
        const newPaymentValues = {
            value: '98765',
        }

        it('Should return response code 400', async function() {
            targetPaymentId = paymentDbObjArr[1].id
            const response = await request({
                method: 'PATCH',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments/${targetPaymentId}`,
                resolveWithFullResponse: true,
                json: true,
                body: newPaymentValues,
                simple: false
            })
            expect(response.statusCode).to.equal(400)
        })
    })

    describe('Update payment entity using forbidden fields with PATCH', function() {
        let targetPaymentId
        const newPaymentValues = {
            contractId: '12345',
            value: '98765',
        }

        it('Should return response code 400', async function() {
            targetPaymentId = paymentDbObjArr[2].id
            const response = await request({
                method: 'PATCH',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments/${targetPaymentId}`,
                resolveWithFullResponse: true,
                json: true,
                body: newPaymentValues,
                simple: false
            })
            expect(response.statusCode).to.equal(400)
        })
    })
    
    describe('Delete payment entity with DELETE', function() {
        let targetPaymentId
        it('Should return 200 response', async function() {
            targetPaymentId = paymentDbObjArr[1].id
            const response = await request({
                method: 'DELETE',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments/${targetPaymentId}`,
                resolveWithFullResponse: true,
                json: true
            })
            expect(response.statusCode).to.equal(200)
        })

        it('Should mark payment entity as \'deleted\'', async function() {
            const retrievedPayment = await Payment.findById(targetPaymentId)
            expect(retrievedPayment.isDeleted).to.equal(true)
        })
    })

    after('Delete dummy data', async function() {
        await Contract.deleteMany({ propertyAddress: 'database test' })
        await Payment.deleteMany({ description: 'database test' })
    })
})

after('Close DB connection', function() {
    db.disconnect()
})