const mongoose = require('mongoose');

function init() {
    mongoose.connect(``, { useNewUrlParser: true })
        .then(function() {
            console.log('DB connection established');
        })
        .catch(function(err) {
            console.log(err);
        })
}

function disconnect() {
    mongoose.disconnect();
    console.log('DB connection closed');
}

module.exports = {
    init,
    disconnect
}
