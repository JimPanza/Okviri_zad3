const transakcijeRouter = require('express').Router()
const Transakcija = require('../models/transakcija')

transakcijeRouter.get('/', async (req, res) => {
    const transakcije = await Transakcija.find({})
    res.json(transakcije)
})

transakcijeRouter.get('/:id', async (req, res) => {
    const transakcija = await Transakcija.findById(req.params.id)
    res.json(transakcija)
})

transakcijeRouter.delete('/:id', async (req, res) => {
    await Transakcija.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

transakcijeRouter.put('/:id', async (req, res) => {
    const podatak = req.body
    const id = req.params.id

    const poruka = {
        iznos: podatak.iznos
    }

    const novaTransakcija = await Transakcija.findByIdAndUpdate(id, poruka, { new: true })
    res.json(novaTransakcija)
})

transakcijeRouter.post('/', async (req, res) => {

    const podatak = req.body

    const novaTransakcija = new Transakcija({
        vrsta: podatak.vrsta,
        datum: podatak.datum,
        opis: podatak.opis,
        iznos: podatak.iznos,
    })

    const spremljenaTransakcija = await novaTransakcija.save()
    res.json(spremljenaTransakcija)
})

module.exports = transakcijeRouter