const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const paymentSchema = new Schema(
    {
        contractId: {
            type: ObjectId,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        time: {
            type: Date,
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

paymentSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id }
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
