const router = require('express').Router()
const paymentsApiControllers = require('../controllers/paymentsApi')

router.get('/contracts/:contractId/payments', paymentsApiControllers.getPayments)

router.post('/contracts/:contractId/payments', paymentsApiControllers.createPayment)

router.patch('/contracts/:contractId/payments/:paymentId', paymentsApiControllers.updatePayment)

router.delete('/contracts/:contractId/payments/:paymentId', paymentsApiControllers.deletePayment)

module.exports = router
