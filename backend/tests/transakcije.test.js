const mongoose = require('mongoose')
const supertest = require('supertest')
const backend = require('../app')
const Transakcija = require('../models/transakcija')
const pomocni = require('./test_pomocni')
const api = supertest(backend)

beforeEach(async () => {
    await Transakcija.deleteMany({})
    let novaTransakcija = new Transakcija(pomocni.pocetneTransakcije[0])
    await novaTransakcija.save()
    novaTransakcija = new Transakcija(pomocni.pocetneTransakcije[1])
    await novaTransakcija.save()
    novaTransakcija = new Transakcija(pomocni.pocetneTransakcije[2])
    await novaTransakcija.save()
})

test('Transakcije se vraćaju kao JSON', async () => {
    await api
        .get('/api/transakcije')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Dohvaća sve transakcije', async () => {
    const odgovor = await api.get('/api/transakcije')
  
    expect(odgovor.body).toHaveLength(pomocni.pocetneTransakcije.length)
  })

test('Iznos druge transakcije je 700', async () => {
    const odgovor = await pomocni.transakcijeIzBaze()

    const sadrzaj = odgovor[1].iznos
    expect(sadrzaj).toBe(700)
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
    const novoDodavanje = await pomocni.transakcijeIzBaze()
    expect(novoDodavanje).toHaveLength(pomocni.pocetneTransakcije.length)
})

test('Ispravno brisanje transakcije', async () => {
    const pocetne = await pomocni.transakcijeIzBaze()
    const zaBrisanje = pocetne[0]
    
    await api
        .delete(`/api/transakcije/${zaBrisanje.id}`)
        .expect(204)
    const zaKraj = await pomocni.transakcijeIzBaze()
    expect(zaKraj).toHaveLength(pocetne.length - 1)
    
    const sadrzaj = zaKraj.map(p => p.opis)
    expect(sadrzaj).not.toContain(zaBrisanje.opis)
})

afterAll(() => {
    mongoose.connection.close()
})