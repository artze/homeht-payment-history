const ApplicationError = require('./ApplicationError')

class ResourceNotFoundError extends ApplicationError {
    constructor(message) {
        super(message)
    }
}

module.exports = ResourceNotFoundError