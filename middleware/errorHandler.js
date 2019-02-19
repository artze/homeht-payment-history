function errorHandler(err, req, res, next) {
    console.log(err);
    switch (err.name) {
        case 'ResourceNotFoundError':
        res.status(404).json({
            error: err.name,
            errorMessage: err.message
        });
        break;

        default:
        res.status(500).end();
        break;
    }
  }
  
module.exports = errorHandler;
