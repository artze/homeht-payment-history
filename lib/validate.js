// @ts-check
/**
 * This module validates all data inputs to Payment API by examining:
 * -Request body
 * -Request URL params
 * -Request query strings
 */

const moment = require('moment')
const InvalidInputError = require('../errors/InvalidInputError')
const contractDbService = require('../services/db/contract')

const errorMessages = {
    startDateError: 'Start date format is incorrect',
    endDateError: 'End date format is incorrect',
    dateOrderError: 'End date is before start date',
    missingDateFieldsError: 'Date fields are missing or have incorrect field names',
    forbiddenUpdateFields: 'Input contains forbidden fields or incorrect field names',
    invalidDataTypes: 'Input contains invalid data types'
}

const paymentObjectPropertyDataTypes = {
    description: 'string',
    value: 'number',
    time: 'string',
    isImported: 'boolean'
}

function startEndDates(startDate, endDate) {
    const startDateMoment = moment(startDate, 'YYYY-MM-DD', true)
    const endDateMoment = moment(endDate, 'YYYY-MM-DD', true)
    const endDateIsAfterStartDate = endDateMoment.isAfter(startDateMoment, 'day')

    if(!startDateMoment.isValid()) {
        throw new InvalidInputError(errorMessages.startDateError)
    }

    if(!endDateMoment.isValid()) {
        throw new InvalidInputError(errorMessages.endDateError)
    }

    if(!endDateIsAfterStartDate) {
        throw new InvalidInputError(errorMessages.dateOrderError)
    }
}

async function existenceOfContractId(contractId) {
    await contractDbService.findContractId(contractId)
}

async function createPaymentInput(req) {
    const incomingPaymentObj = req.body
    const contractId = req.params.contractId
    const inputFields = Object.keys(incomingPaymentObj)
    
    // check data type of each createPayment object property
    const hasValidDataTypes = inputFields.every(function(field) {
        return typeof incomingPaymentObj[field] === paymentObjectPropertyDataTypes[field]
    })

    if(!hasValidDataTypes) {
        throw new InvalidInputError(errorMessages.invalidDataTypes)
    }

    // check if contractId exists
    await existenceOfContractId(contractId)
}

function getPaymentsInput(req) {
    // check existence of startDate and endDate properties in query string
    const hasStartDate = req.query.hasOwnProperty('startDate')
    const hasEndDate = req.query.hasOwnProperty('endDate')

    if(!hasStartDate || !hasEndDate) {
        throw new InvalidInputError(errorMessages.missingDateFieldsError)
    }

    // check validity of start and end dates
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    startEndDates(startDate, endDate)
}

function updatePaymentInput(req) {
    const incomingPaymentObj = req.body
    const inputFields = Object.keys(incomingPaymentObj)
    
    // check that updatePayement object includes only allowed fields
    const allowedFields = ['description', 'value', 'time', 'isImported']

    const allowedFieldsProvided = inputFields.every(function(field) {
        return allowedFields.includes(field)
    })

    if(!allowedFieldsProvided) {
        throw new InvalidInputError(errorMessages.forbiddenUpdateFields)
    }

    // check data type of each updatePayment object property
    const hasValidDataTypes = inputFields.every(function(field) {
        return typeof incomingPaymentObj[field] === paymentObjectPropertyDataTypes[field]
    })

    if(!hasValidDataTypes) {
        throw new InvalidInputError(errorMessages.invalidDataTypes)
    }
}

module.exports = {
    errorMessages,
    startEndDates,
    existenceOfContractId,
    createPaymentInput,
    getPaymentsInput,
    updatePaymentInput
}