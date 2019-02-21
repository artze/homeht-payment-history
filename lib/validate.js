// @ts-check
/**
 * This module validates all data inputs to Payment API by examining:
 * -Request body
 * -Request URL params
 * -Request query strings
 */

const moment = require('moment')
const InvalidInputError = require('../errors/InvalidInputError')

const errorMessages = {
    startDateError: 'Start date format is incorrect',
    endDateError: 'End date format is incorrect',
    dateOrderError: 'End date is before start date',
    missingDateFieldsError: 'Date fields are missing or have incorrect field names'
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

module.exports = {
    errorMessages,
    startEndDates,
    getPaymentsInput
}