const expect = require('chai').expect
const request = require('request-promise-native')
const db = require('../db')
const Contract = require('../db/models/Contract')
const Payment = require('../db/models/Payment')
const domainUrl = require('./config').domainUrl
const paymentData = require('./fixtures/paymentData')
const contractData = require('./fixtures/contractData')

describe('Test payments API endpoints', function() {
    let contractDbObj
    let paymentDbObjArr

    before('Create Contract and Payment dummy data', async function() {
        db.init()

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
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments?${queryString}`,
                resolveWithFullResponse: true
            })
            expect(response.statusCode).to.equal(200)
        })

        it('Should return correct list of payments', async function() {
            const response = await request({
                url: `${domainUrl}/contracts/${contractDbObj.id}/payments?${queryString}`,
                resolveWithFullResponse: true
            })
            const parsedResponseBody = JSON.parse(response.body)
            expect(parsedResponseBody.length).to.equal(2)
        })
    })

    // describe('Create payment entity with POST', function() {
    //     it('Should return 201 response', function(done) {
    //         request.post({
    //             url: `${domainUrl}/contracts/${contractDbObj.id}/payments`,
    //             json: true,
    //             body: paymentData.single
    //         }, function(err, res) {
    //             expect(res.statusCode).to.equal(201)
    //             done()
    //         })
    //     })
    // })

    // describe('Calling PATCH to /payments/:paymentId', function() {
    //     it('Should return 200 response', function(done) {
    //         request.patch({
    //             url: `${paymentApiUrl}/1`
    //         }, function(err, res) {
    //             expect(res.statusCode).to.equal(200)
    //             done()
    //         })
    //     })
    // })
    
    // describe('Calling DELETE to /payments/:paymentId', function() {
    //     it('Should return 200 response', function(done) {
    //         request.delete({
    //             url: `${paymentApiUrl}/1`
    //         }, function(err, res) {
    //             expect(res.statusCode).to.equal(200)
    //             done()
    //         })
    //     })
    // })

    after('Delete dummy data and close DB connection', async function() {
        await Contract.deleteMany({ propertyAddress: 'database test' })
        await Payment.deleteMany({ description: 'database test' })
        db.disconnect()
    })
})