const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contractSchema = new Schema(
    {
        propertyAddress: {
            type: String,
            required: true
        },
        isImported: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

contractSchema.virtual('id').get(function() {
    return this._id
})

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract
