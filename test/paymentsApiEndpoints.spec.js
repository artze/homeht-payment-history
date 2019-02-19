const expect = require('chai').expect
const request = require('request')
const domainUrl = require('./config').domainUrl
const paymentApiUrl = `${domainUrl}/contracts/2/payments`

describe('Test payments API endpoint are routed correctly', function() {
    describe('Calling GET to /payments', function() {
        it('Should return 200 response', function(done) {
            request.get({
                url: paymentApiUrl
            }, function(err, res) {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
    })

    describe('Calling POST to /payments', function() {
        it('Should return 201 response', function(done) {
            request.post({
                url: paymentApiUrl
            }, function(err, res) {
                expect(res.statusCode).to.equal(201)
                done()
            })
        })
    })

    describe('Calling PATCH to /payments/:paymentId', function() {
        it('Should return 200 response', function(done) {
            request.patch({
                url: `${paymentApiUrl}/1`
            }, function(err, res) {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
    })
    
    describe('Calling DELETE to /payments/:paymentId', function() {
        it('Should return 200 response', function(done) {
            request.delete({
                url: `${paymentApiUrl}/1`
            }, function(err, res) {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
    })
})