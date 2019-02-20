const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '..', '.env') })
const expect = require('chai').expect
const db = require('../../../../db')
const paymentDbService = require('../../../../services/db/payment')
const Payment = require('../../../../db/models/Payment')
const paymentData = require('../../../fixtures/paymentData')

describe('Test payment db service', function() {
    before('Establish DB connection', async function() {
        await db.init()
    })

    describe('Create payment', function() {
        it('Should create payment entity in db', async function() {
            await paymentDbService.createPayment(paymentData)

            let retrievedPayment = await Payment.findOne({ description: 'database test' })
            expect(retrievedPayment.contractId.toString()).to.equal(paymentData.contractId)
            expect(retrievedPayment.description).to.equal(paymentData.description)
            expect(retrievedPayment.value).to.equal(paymentData.value)
            expect(retrievedPayment.time).to.deep.equal(paymentData.time)
            expect(retrievedPayment.isImported).to.equal(false)
            expect(retrievedPayment.isDeleted).to.equal(false)
        })
    })

    describe('Delete payment', function() {
        let paymentForDeleteTest

        before('Create dummy data entity', async function() {
            paymentForDeleteTest = await Payment.create(paymentData)
        })

        it('Should mark payment as \'deleted\'', async function() {
            await paymentDbService.deletePayment(paymentForDeleteTest.id)

            let retrievedPayment = await Payment.findById(paymentForDeleteTest.id)
            expect(retrievedPayment.isDeleted).to.equal(true)
        })
    })

    describe('Update payment', function() {
        let paymentForUpdateTest

        before('Create dummy data entity', async function() {
            paymentForUpdateTest = await Payment.create(paymentData)
        })

        it('Should update payment', async function() {
            await paymentDbService.updatePayment(paymentForUpdateTest.id, { value: 999, isImported: true })

            let retrievedPayment = await Payment.findById(paymentForUpdateTest.id)
            expect(retrievedPayment.value).to.equal(999)
            expect(retrievedPayment.isImported).to.equal(true)
        })
    })

    after('Close DB connection', async function() {
        await Payment.deleteMany({ description: 'database test' })
        db.disconnect()
    })
})