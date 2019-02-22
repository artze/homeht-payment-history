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
            expect(response.body.length).to.equal(2)
        })
    })

    describe('Create payment entity with POST', function() {
        it('Should return 201 response', async function() {
            const response = await request({
                method: 'POST',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments`,
                resolveWithFullResponse: true,
                json: true,
                body: paymentData.single
            })
            expect(response.statusCode).to.equal(201)
        })

        it('Should create payment entity in database', async function() {
            const response = await request({
                method: 'POST',
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments`,
                resolveWithFullResponse: true,
                json: true,
                body: paymentData.single
            })
            const retrievedPayment = await Payment.findById(response.body.id)
            expect(retrievedPayment.description).to.equal('database test')
            expect(retrievedPayment.contractId.toString()).to.equal(contractDbObj.id)
        })
    })

    describe('Update payment entity with PATCH', function() {
        let targetPaymentId
        const newPaymentValues = {
            value: 98765,
            time: new Date('2000-01-01')
        }

        it('Should return 200 response', async function() {
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
            expect(retrievedPayment.time).to.deep.equal(newPaymentValues.time)
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