const mongoose = require('mongoose')

const password = process.env.ATLAS_PASS
const dbname = 'domaci'

const url = `mongodb+srv://androb:${password}@domaci.vn9mv.mongodb.net/${dbname}?retryWrites=true&w=majority`

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

const Transakcija = mongoose.model('Transakcija', transakcijaSchema, 'transakcije')

console.log("Spajamo se na bazu")
mongoose.connect(url)
 .then(result => {
 console.log("Spojeni smo na bazu");
 })
 .catch(error => {
 console.log("Greška pri spajanju", error.message);
 }) 

module.exports = Transakcija;