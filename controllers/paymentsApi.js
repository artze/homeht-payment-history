// @ts-check
const paymentDbService = require('../services/db/payment')

function getPayments(req, res, next) {
    const filter = {
        contractId: req.params.contractId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    }
    paymentDbService.getPaymentsWithFilter(filter)
        .then(function(fetchedPayments) {
            res.status(200).json(fetchedPayments)
        })
        .catch(function(err) {
            return next(err)
        })
}

function createPayment(req, res, next) {
    const payment = {
        contractId: req.params.contractId,
        description: req.body.description,
        value: req.body.value,
        time: new Date(req.body.time)
    }
    paymentDbService.createPayment(payment)
        .then(function(createdPayment) {
            res.status(201).json(createdPayment)
        })
        .catch(function(err) {
            return next(err)
        })
}

function updatePayment(req, res) {
    res.status(200).end()
}

function deletePayment(req, res) {
    res.status(200).end()
}

module.exports = {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment
}