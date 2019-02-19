const router = require('express').Router()
const paymentsApiControllers = require('../controllers/paymentsApi')

router.get('/', paymentsApiControllers.getPayments)

router.post('/', paymentsApiControllers.createPayment)

router.patch('/:paymentId', paymentsApiControllers.updatePayment)

router.delete('/:paymentId', paymentsApiControllers.deletePayment)

module.exports = router
