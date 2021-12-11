const mongoose = require('mongoose')
const supertest = require('supertest')
const backend = require('../app')

const api = supertest(backend)

test('Transakcije se vraćaju kao JSON', async () => {
    await api
    .get('/api/transakcije')
    .expect(200)
    .expect('Content-Type', /application\/json/)
   })

afterAll(() => {
    mongoose.connection.close()
})