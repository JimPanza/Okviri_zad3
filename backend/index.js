let poruke = [

]

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('<h1>Pozdrav od Express servera</h1>')
})

app.get('/api/transakcije', (req, res) => {
    res.json(poruke)
})

app.get('/api/transakcije/:id', (req, res) => {
    const id = req.params.id
    const poruka = poruke.find(p => p.id === id)
    res.json(poruka)
})

app.delete('/api/transakcije/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log("Brisem poruku sa ID:", id);
    poruke = poruke.filter(p => p.id !== id)

    res.status(204).end()
})

app.put('/api/transakcije/:id', (req, res) => {

    const podatak = req.body
    const id = Number(req.params.id)
    console.log("Promjena iznosa transakcije sa id: ", id)
    poruke = poruke.map(p => p.id !== id ? p : podatak)
    res.json(podatak)
})

app.post('/api/transakcije', (req, res) => {

    const podatak = req.body
    if (!podatak.iznos) {
        return res.status(400).json({
            error: 'Nedostaje sadržaj'
        })
    }

    const poruka = {
        id: generirajId(),
        vrsta: podatak.vrsta,
        datum: podatak.datum,
        opis: podatak.opis,
        iznos: podatak.iznos,
    }
    poruke = poruke.concat(poruka)

    res.json(poruka)
})

const generirajId = () => {
    const maxId = poruke.length > 0
        ? Math.max(...poruke.map(p => p.id))
        : 0
    return maxId + 1
}

const PORT = 3001
app.listen(PORT)
console.log(`Posluzitelj je pokrenut na portu ${PORT}`);