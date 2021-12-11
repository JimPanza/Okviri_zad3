const mongoose = require('mongoose')
const supertest = require('supertest')
const backend = require('../app')
const Transakcija = require('../models/transakcija')

const api = supertest(backend)

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

beforeEach(async () => {
    await Transakcija.deleteMany({})
    let novaTransakcija = new Transakcija(pocetneTransakcije[0])
    await novaTransakcija.save()
    novaTransakcija = new Transakcija(pocetneTransakcije[1])
    await novaTransakcija.save()
    novaTransakcija = new Transakcija(pocetneTransakcije[2])
    await novaTransakcija.save()
})


test('Transakcije se vraćaju kao JSON', async () => {
    await api
        .get('/api/transakcije')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Iznos druge transakcije je 700', async () => {
    const odgovor = await api.get('/api/transakcije')

    const sadrzaj = odgovor.body.map(p => p.iznos)
    expect(sadrzaj[1] === 400)
})

test('Dodavanje transakcije bez iznosa', async () => {
    const novaTransakcija = {
        vrsta: "Prihod",
        datum: "2021.12.11",
        opis: "Bez iznosa",
    }
    await api
        .post('/api/transakcije')
        .send(novaTransakcija)
        .expect(400)
    const odgovor = await api.get('/api/transakcije')
    expect(odgovor.body).toHaveLength(pocetneTransakcije.length)
})

afterAll(() => {
    mongoose.connection.close()
})