const single = {
    contractId: '5a80785d802b546104b98714',
    description: 'database test',
    value: 300,
    time: new Date('2018-12-31').toISOString()
}

const multiple = [
    {
        contractId: '9a80785d802b546104b987c3',
        description: 'database test',
        value: 300,
        time: new Date('2018-01-31').toISOString()
    },
    {
        contractId: '9a80785d802b546104b987c3',
        description: 'database test',
        value: 370,
        time: new Date('2018-02-01').toISOString()
    },
    {
        contractId: '9a80785d802b546104b987c3',
        description: 'database test',
        value: 400,
        time: new Date('2018-02-15').toISOString()
    },
    {
        contractId: '9a80785d802b546104b987c3',
        description: 'database test',
        value: 600,
        time: new Date('2018-03-02').toISOString()
    },
    {
        contractId: '9a80785d802b546104b987c3',
        description: 'database test',
        value: 300,
        time: new Date('2018-04-02').toISOString()
    },
    {
        contractId: '9a80785d802b546104b987c3',
        description: 'database test',
        value: 400,
        time: new Date('2018-06-01').toISOString()
    }
]

module.exports = {
    single,
    multiple
}