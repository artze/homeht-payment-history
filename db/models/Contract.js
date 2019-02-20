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

contractSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id }
})

contractSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id }
})

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract
