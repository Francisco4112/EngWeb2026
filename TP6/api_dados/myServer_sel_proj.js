const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const d = new Date().toISOString().substring(0, 19)
  console.log(`${req.method} ${req.url} ${d}`)
  next()
})

const dbName = 'cinema'
const mongoUrl = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${dbName}`

mongoose.connect(mongoUrl)
  .then(() => console.log(`MongoDB: ligado a ${dbName}.`))
  .catch((err) => console.error('Erro MongoDB:', err))

const schemaOptions = { strict: false, versionKey: false }
const Filme = mongoose.model('Filme', new mongoose.Schema({}, { ...schemaOptions, collection: 'filmes' }))
const Ator = mongoose.model('Ator', new mongoose.Schema({}, { ...schemaOptions, collection: 'atores' }))
const Genero = mongoose.model('Genero', new mongoose.Schema({}, { ...schemaOptions, collection: 'generos' }))

function buildListQueryParams(req) {
  const queryObj = { ...req.query }
  const fields = queryObj._select
  const sortField = queryObj._sort
  const order = queryObj._order === 'desc' ? -1 : 1

  delete queryObj._select
  delete queryObj._sort
  delete queryObj._order

  const projection = {}
  if (fields) {
    fields.split(',').forEach((f) => {
      projection[f.trim()] = 1
    })
  }

  const sort = sortField ? { [sortField]: order } : {}
  return { mongoQuery: queryObj, projection, sort }
}

async function listCollection(req, res, Model) {
  try {
    const { mongoQuery, projection, sort } = buildListQueryParams(req)
    let query = Model.find(mongoQuery, projection)
    if (Object.keys(sort).length > 0) query = query.sort(sort)
    const docs = await query.exec()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getById(req, res, Model) {
  try {
    const doc = await Model.findOne({ id: req.params.id }).exec()
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' })
    return res.json(doc)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

app.get('/filmes', (req, res) => listCollection(req, res, Filme))
app.get('/filmes/:id', (req, res) => getById(req, res, Filme))

app.get('/atores', (req, res) => listCollection(req, res, Ator))
app.get('/atores/:id', (req, res) => getById(req, res, Ator))

app.get('/generos', (req, res) => listCollection(req, res, Genero))
app.get('/generos/:id', (req, res) => getById(req, res, Genero))

app.listen(7789, () => console.log('API em http://localhost:7789'))
