const mongoose = require('mongoose')

const transakcijaSchema = new mongoose.Schema({
 vrsta: String,
 datum: String,
 opis: String,
 iznos: Number
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