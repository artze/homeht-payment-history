const mongoose = require('mongoose')

function init() {
    mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds029655.mlab.com:29655/homeht-payment-history`, { useNewUrlParser: true })
        .then(function() {
            console.log('DB connection established')
        })
        .catch(function(err) {
            console.log(err)
        })
}

function disconnect() {
    mongoose.disconnect()
    console.log('DB connection closed')
}

module.exports = {
    init,
    disconnect
}
