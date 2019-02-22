const mongoose = require('mongoose')
const Payment = require('../../db/models/Payment')
const ResourceNotFoundError = require('../../errors/ResourceNotFoundError')

/**
 * Custom object definitions
 * 
 * Payment object type for payment entity creation
 * @typedef PaymentObject
 * @type {Object}
 * @property {string} contractId
 * @property {number} value
 * @property {Object} time
 * 
 * Payment object type for updating payment entity
 * @typedef UpdatedPaymentObject
 * @type {Object}
 * @property {string} [description]
 * @property {number} [value]
 * @property {Object} [time]
 * @property {boolean} [isImported]
 * 
 * Filter object type for querying payments
 * @typedef PaymentFilterObject
 * @type {Object}
 * @property {string} contractId
 * @property {string} startDate
 * @property {string} endDate
 */

/**
 * Creates payment entity in database
 * @param {PaymentObject} payment - Payment object to be created
 * @returns {Promise}
 */
function createPayment(payment) {
    return new Promise(function(resolve, reject) {
        Payment.create(payment)
            .then(function(createdPayment) {
                resolve(createdPayment)
            })
            .catch(function(err) {
                reject(err)
            })
    })
}

/**
 * Marks payment entity in database as 'deleted'
 * @param {string} paymentId - Id of payment to be deleted
 * @returns {Promise}
 */
function deletePayment(paymentId) {
    return new Promise(function(resolve, reject) {
        Payment.findByIdAndUpdate(paymentId, {
            isDeleted: true
        })
            .then(function(foundPaymentObject) {
                if(foundPaymentObject === null) {
                    throw new ResourceNotFoundError('Payment resource not found')
                }
                resolve()
            })
            .catch(function(err) {
                if(err instanceof mongoose.Error.CastError) {
                    reject(new ResourceNotFoundError('Payment id is incorrect'))
                }
                reject(err)
            })
    })
}

/**
 * Updates payment entity in database with new payment values
 * @param {string} paymentId - Id of payment to be updated
 * @param {UpdatedPaymentObject} updatedPayment - Payment object with new values
 * @returns {Promise}
 */
function updatePayment(paymentId, updatedPayment) {
    return new Promise(function(resolve, reject) {
        Payment.findByIdAndUpdate(paymentId, updatedPayment)
            .then(function(foundPaymentObject) {
                if(foundPaymentObject === null) {
                    throw new ResourceNotFoundError('Payment resource not found')
                }
                resolve()
            })
            .catch(function(err) {
                if(err instanceof mongoose.Error.CastError) {
                    reject(new ResourceNotFoundError('Payment id is incorrect'))
                }
                reject(err)
            })
    })
}

/**
 * Fetches payment entities from database that fulfils contractId, startDate, endDate
 * @param {PaymentFilterObject} filter - Determines payment fetching conditions
 * @returns {Promise}
 */
function getPaymentsWithFilter(filter) {
    const conditions = {
        contractId: filter.contractId,
        time: {
            $gte: new Date(filter.startDate),
            $lte: new Date(filter.endDate)
        }
    }
    return new Promise(function(resolve, reject) {
        Payment.find(conditions)
            .then(function(fetchedPayments) {
                resolve(fetchedPayments)
            })
            .catch(function(err) {
                reject(err)
            })
    })
}

module.exports = {
    createPayment,
    deletePayment,
    updatePayment,
    getPaymentsWithFilter
}
