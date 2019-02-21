const ApplicationError = require('./ApplicationError')

class InvalidInputError extends ApplicationError {
    constructor(message) {
        super(message)
    }
}

module.exports = InvalidInputError