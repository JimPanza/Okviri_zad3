const transakcijeRouter = require('express').Router()
const Transakcija = require('../models/transakcija')

transakcijeRouter.get('/', (req, res) => {
    Transakcija.find({}).then(rezultat => {
        res.json(rezultat)
    })
})

transakcijeRouter.get('/:id', (req, res, next) => {
    Transakcija.findById(req.params.id)
        .then(poruka => {
            if (poruka) {
                res.json(poruka)
            } else {
                res.status(404).end()
            }

        })
        .catch(err => next(err))
})

transakcijeRouter.delete('/:id', (req, res) => {
    Transakcija.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

transakcijeRouter.put('/:id', (req, res) => {
    const podatak = req.body
    const id = req.params.id

    const poruka = {
        iznos: podatak.iznos
    }
    Transakcija.findByIdAndUpdate(id, poruka, { new: true })
        .then(novaPoruka => {
            res.json(novaPoruka)
        })
        .catch(err => next(err))
})

transakcijeRouter.post('/', (req, res, next) => {

    const podatak = req.body
    if (!podatak.iznos) {
        return res.status(400).json({
            error: 'Nedostaje sadržaj'
        })
    }

    const novaTransakcija = new Transakcija({
        vrsta: podatak.vrsta,
        datum: podatak.datum,
        opis: podatak.opis,
        iznos: podatak.iznos,
    })
    novaTransakcija.save().then(rezultat => {
        res.json(rezultat)
    })
    .catch(err => next(err))
})

module.exports = transakcijeRouter