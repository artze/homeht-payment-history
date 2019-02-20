const Payment = require('../../db/models/Payment')

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

function deletePayment(paymentId) {
    return new Promise(function(resolve, reject) {
        Payment.findByIdAndUpdate(paymentId, {
            isDeleted: true
        })
            .then(function() {
                resolve()
            })
            .catch(function(err) {
                reject(err)
            })
    })
}

module.exports = {
    createPayment,
    deletePayment
}