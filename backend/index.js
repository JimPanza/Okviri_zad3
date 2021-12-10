let poruke = [

]

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const Transakcija = require("./models/transakcija")


app.get('/', (req, res) => {
    res.send('<h1>Pozdrav od Express servera</h1>')
})

app.get('/api/transakcije', (req, res) => {
    Transakcija.find({}).then(rezultat => {
        res.json(rezultat)
    })
})

app.get('/api/transakcije/:id', (req, res, next) => {
    Transakcija.findById(req.params.id)
        .then(rezultat => {
            if (rezultat) {
                res.json(rezultat)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })

})


app.delete('/api/transakcije/:id', (req, res, next) => {
    Transakcija.findByIdAndRemove(req.params.id)
    .then(result => {
    res.status(204).end()
    })
    .catch(err => next(err))
   })

app.put('/api/transakcije/:id', (req, res) => {
    const podatak = req.body
    const id = req.params.id

    const poruka = {
    iznos: podatak.iznos
    }
    Transakcija.findByIdAndUpdate(id, poruka, {new: true})
    .then( novaPoruka => {
    res.json(novaPoruka)
    })
    .catch(err => next(err))
   })
   

app.post('/api/transakcije', (req, res) => {

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
    /* poruke = poruke.concat(poruka) */
    novaTransakcija.save().then(rezultat => {
        res.json(rezultat)
    })
})

/* const generirajId = () => {
    const maxId = poruke.length > 0
        ? Math.max(...poruke.map(p => p.id))
        : 0
    return maxId + 1
} */

const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'krivi format ID-a' })
    }
    next(err)
}

function zadnjiErrorHandler(err, req, res, next) {
    res.status(500).send('error', { error: err })
}

app.use(errorHandler)
app.use(zadnjiErrorHandler)

const PORT = 3001
app.listen(PORT)
console.log(`Posluzitelj je pokrenut na portu ${PORT}`);