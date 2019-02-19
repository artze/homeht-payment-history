/**
 * Script to seed database with initial collection of Contracts and Payments
 * Run with npm script 'npm run seed'. Run once only on new databases
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const db = require('../db')
const Payment = require('../db/models/Payment')
const Contract = require('../db/models/Contract')

const contractArr = [
    {
        propertyAddress: '123 Berlinerstrasse, Berlin, Germany'
    }
]

const paymentArr = [
    {
        description: 'Rent payment',
        value: 500,
        time: new Date('2018-03-02'),
    },
    {
        description: 'Rent charges',
        value: -500,
        time: new Date('2018-03-01'),
    },
    {
        description: 'Rent charges',
        value: -700,
        time: new Date('2018-04-02'),
    },
    {
        description: 'Rent charges',
        value: -600,
        time: new Date('2018-05-02'),
    },
    {
        description: 'Rent payment',
        value: 800,
        time: new Date('2018-06-02'),
    }
]

db.init()

function getRandomIndexOfArray(arr) {
    return Math.floor(Math.random() * arr.length)
}

function seedContracts() {
    let seedContractsPromiseArr = []
    contractArr.forEach(function(contract) {
        let promise = Contract.create(contract)
            .then(function(createdObj) {
                console.log(`${createdObj} \n added to database\n`)
            })
            .catch(function(err) {
                console.log(err)
            })
        
        seedContractsPromiseArr.push(promise)
    })

    return Promise.all(seedContractsPromiseArr)
}

function seedPayments(contractIdArr) {
    let seedPaymentsPromiseArr = []
    paymentArr.forEach(function(payment) {
        let promise = Payment.create({
            ...payment,
            contractId: contractIdArr[getRandomIndexOfArray(contractIdArr)].id
        })
            .then(function(createdObj) {
                console.log(`${createdObj} \n added to database\n`)
            })
            .catch(function(err) {
                console.log(err)
            })

        seedPaymentsPromiseArr.push(promise)
    })

    return Promise.all(seedPaymentsPromiseArr)
}

async function seedDatabase() {
    await seedContracts()
    const contractIdArr = await Contract.find({}).select('id')
    await seedPayments(contractIdArr)
    db.disconnect()
}

seedDatabase()