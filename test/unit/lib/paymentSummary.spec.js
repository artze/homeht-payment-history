const expect = require('chai').expect
const paymentSummary = require('../../../lib/paymentSummary')
const paymentData = require('../../fixtures/paymentData')

describe('Test payment summary formatter module', function() {
    let result

    before('Get transformation result', function() {
        result = paymentSummary.transform(paymentData.multiple)
    })

    it('Should display correct sum', function() {
        const sumOfValuesInPaymentData = paymentData.multiple
            .map(function(paymentObj) {
                return paymentObj.value
            })
            .reduce(function(accumulator, currentValue) {
                return accumulator + currentValue
            }, 0)
        expect(result.sum).to.equal(sumOfValuesInPaymentData)
    })

    it('Should contain property \'items\'', function() {
        expect(result).to.haveOwnProperty('items')
    })

    it('\'items\' property should contain Array', function() {
        expect(result.items).to.be.an('array')
    })
})