const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const transakcijeRouter = require('./controllers/transakcije')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Spajam se na', config.DB_URI)

mongoose.connect(config.DB_URI,)
.then(result => {
  logger.info("Spojeni smo na bazu");
}).catch(error => {
  logger.greska("Greška pri spajanju", error.message);
})


app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.zahtjevInfo)

app.use('/api/transakcije', transakcijeRouter)

app.use(middleware.nepoznataRuta)
app.use(middleware.errorHandler)

module.exports = app