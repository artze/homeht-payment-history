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
    dateOrderError: 'End date is before start date'
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

module.exports = {
    errorMessages,
    startEndDates
}