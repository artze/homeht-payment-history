const applicationController = require('../controllers/application')
const errorHandler = require('../middleware/errorHandler')

function init(app) {

    app.all('*', applicationController.handleResourceNotFound)

    app.use(errorHandler)

}

module.exports = {
    init
}
