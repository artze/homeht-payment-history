const expect = require('chai').expect
const InvalidInputError = require('../../../errors/InvalidInputError')
const validate = require('../../../lib/validate')

describe('Validate start and end dates', function() {
    it('Should not throw an error with correct dates', function() {
        expect(function() {
            validate.startEndDates('2011-01-01', '2011-02-02')
        })
            .to.not.throw()
    })

    it('Should throw InvalidInputError with incorrect start date format', function() {
        expect(function() {
            validate.startEndDates('2011-13-02', '2012-02-02')
        })
            .to.throw(InvalidInputError, validate.errorMessages.startDateError)
        
        expect(function() {
            validate.startEndDates('20111002', '2012-02-02')
        })
            .to.throw(InvalidInputError, validate.errorMessages.startDateError)
    })
    
    it('Should throw InvalidInputError with incorrect end date format', function() {
        expect(function() {
            validate.startEndDates('2011-11-02', '2012-55-02')
        })
            .to.throw(InvalidInputError, validate.errorMessages.endDateError)
        
        expect(function() {
            validate.startEndDates('2011-11-02', '20120502')
        })
            .to.throw(InvalidInputError, validate.errorMessages.endDateError)
    })

    it('Should throw InvalidInputError when end date is before start date', function() {
        expect(function() {
            validate.startEndDates('2018-01-02', '2018-01-01')
        })
            .to.throw(InvalidInputError, validate.errorMessages.dateOrderError)
    })
})