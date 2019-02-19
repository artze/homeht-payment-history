const ResourceNotFoundError = require('../errors/ResourceNotFoundError')

function handleResourceNotFound(req, res, next) {
    next(new ResourceNotFoundError('Resource not found'))
}

module.exports = {
    handleResourceNotFound
}