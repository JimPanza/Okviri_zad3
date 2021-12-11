require('dotenv').config()

const PORT = process.env.PORT
const password = process.env.ATLAS_PASS
const user = process.env.ATLAS_USER
const dbname = process.env.NODE_ENV === 'test' ? 'transakcije-api-test' : 'domaci'

const DB_URI = `mongodb+srv://${user}:${password}@domaci.vn9mv.mongodb.net/${dbname}?retryWrites=true&w=majority`

module.exports = {PORT, DB_URI}