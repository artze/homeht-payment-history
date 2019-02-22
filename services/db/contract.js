// @ts-check
const mongoose = require('mongoose')
const Contract = require('../../db/models/Contract')
const ResourceNotFoundError = require('../../errors/ResourceNotFoundError')

/**
 * Get Contract entity from database
 * @param {string} contractId 
 * @returns {Promise}
 */
function findContractId(contractId) {
    return new Promise(function(resolve, reject) {
        Contract.findById(contractId)
            .then(function(foundContractObj) {
                if(foundContractObj === null) {
                    throw new ResourceNotFoundError('Contract resource not found')
                }
                resolve(foundContractObj)
            })
            .catch(function(err) {
                if(err instanceof mongoose.Error.CastError) {
                    reject(new ResourceNotFoundError('Contract id is incorrect'))
                }
                reject(err)
            })
    })
}

module.exports = {
    findContractId
}
