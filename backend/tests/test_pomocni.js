const Transakcija = require('../models/transakcija')

const pocetneTransakcije = [
    {
        vrsta: "Prihod",
        datum: "2021.12.11",
        opis: "Prva pocetna",
        iznos: 400
    },
    {
        vrsta: "Rashod",
        datum: "2021.12.11",
        opis: "Druga pocetna",
        iznos: 700
    },
    {
        vrsta: "Prihod",
        datum: "2021.12.11",
        opis: "Treca pocetna",
        iznos: 1000
    }
]

const transakcijeIzBaze = async () => {
    const transak = await Transakcija.find({})
    return transak.map(p => p.toJSON())
}

module.exports = {pocetneTransakcije, transakcijeIzBaze}