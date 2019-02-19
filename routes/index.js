const paymentsApiRoutes = require('./paymentsApi')
const applicationController = require('../controllers/application')
const errorHandler = require('../middleware/errorHandler')

function init(app) {

    app.use('/', paymentsApiRoutes)

    app.all('*', applicationController.handleResourceNotFound)

    app.use(errorHandler)

}

module.exports = {
    init
}
