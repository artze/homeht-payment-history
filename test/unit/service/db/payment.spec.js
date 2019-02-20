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
            await paymentDbService.createPayment(paymentData.single)

            let retrievedPayment = await Payment.findOne({ description: 'database test' })
            expect(retrievedPayment.contractId.toString()).to.equal(paymentData.single.contractId)
            expect(retrievedPayment.description).to.equal(paymentData.single.description)
            expect(retrievedPayment.value).to.equal(paymentData.single.value)
            expect(retrievedPayment.time).to.deep.equal(paymentData.single.time)
            expect(retrievedPayment.isImported).to.equal(false)
            expect(retrievedPayment.isDeleted).to.equal(false)
        })
    })

    describe('Delete payment', function() {
        let paymentForDeleteTest

        before('Create dummy data entity', async function() {
            paymentForDeleteTest = await Payment.create(paymentData.single)
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
            paymentForUpdateTest = await Payment.create(paymentData.single)
        })

        it('Should update payment', async function() {
            await paymentDbService.updatePayment(paymentForUpdateTest.id, { value: 999, isImported: true })

            let retrievedPayment = await Payment.findById(paymentForUpdateTest.id)
            expect(retrievedPayment.value).to.equal(999)
            expect(retrievedPayment.isImported).to.equal(true)
        })
    })

    describe('Get array of payments that fulfil \'contractId\', \'startDate\', \'endDate\' criteria', function() {
        before('Create dummy data entities', async function() {
            await Payment.insertMany(paymentData.multiple)
        })

        it('Should fetch array of payments that fulfils contractId, startDate and endDate criteria', async function() {
            let paymentResultArr = await paymentDbService.getPaymentsWithFilter({
                contractId: paymentData.multiple[0].contractId,
                startDate: '2018-02-16',
                endDate: '2018-06-30'
            })
            expect(paymentResultArr.length).to.equal(3)

            paymentResultArr = await paymentDbService.getPaymentsWithFilter({
                contractId: paymentData.multiple[0].contractId,
                startDate: '2018-02-01',
                endDate: '2018-02-28'
            })
            expect(paymentResultArr.length).to.equal(2)
        })
    })

    after('Delete dummy data and close DB connection', async function() {
        await Payment.deleteMany({ description: 'database test' })
        db.disconnect()
    })
})