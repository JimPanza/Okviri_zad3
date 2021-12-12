const mongoose = require('mongoose')

const transakcijaSchema = new mongoose.Schema({
    vrsta: {
        type: String,
        required: true
    },
    datum: {
        type: String,
        required: true
    },
    opis: {
        type: String,
        default: "Transakcija"
    },
    iznos: {
        type: Number,
        required: true
    }
})

transakcijaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('Transakcija', transakcijaSchema, 'transakcije')