/**
 * This module transforms getPayment database query results into a format that shows subtotal
 */

/**
 * Transforms getPayment query result into payments summary format
 * @param {Array<Object>} data - an Array of getPayment results
 * @returns {Object}
 */
function transform(data) {
    const sum = data
        .map(function(paymentObj) {
            return paymentObj.value
        })
        .reduce(function(accumulator, currentValue) {
            return accumulator + currentValue
        }, 0)
    
    return {
        sum: sum,
        items: data
    }
}

module.exports = {
    transform
}