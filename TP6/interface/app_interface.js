const express = require('express')
const axios = require('axios')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static('public'))

const API_BASE = process.env.API_URL || 'http://localhost:7789'

function now() {
  return new Date().toISOString().substring(0, 19)
}

app.get('/', (req, res) => {
  res.redirect('/filmes')
})

app.get('/filmes', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/filmes?_select=id,title,year,cast,genres&_sort=title`)
    const filmes = response.data.map((f) => ({
      ...f,
      nAtores: Array.isArray(f.cast) ? f.cast.length : 0,
      nGeneros: Array.isArray(f.genres) ? f.genres.length : 0
    }))

    res.render('filmes', { filmes, date: now() })
  } catch (err) {
    res.status(500).render('error', {
      message: 'Erro ao obter lista de filmes',
      error: err,
      date: now()
    })
  }
})

app.get('/filmes/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/filmes/${req.params.id}`)
    res.render('filme', { filme: response.data, date: now() })
  } catch (err) {
    res.status(err.response?.status || 500).render('error', {
      message: `Erro ao obter filme ${req.params.id}`,
      error: err,
      date: now()
    })
  }
})

app.get('/atores', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/atores?_select=id,nome,filmes&_sort=nome`)
    const atores = response.data.map((a) => ({
      ...a,
      nFilmes: Array.isArray(a.filmes) ? a.filmes.length : 0
    }))

    res.render('atores', { atores, date: now() })
  } catch (err) {
    res.status(500).render('error', {
      message: 'Erro ao obter lista de atores',
      error: err,
      date: now()
    })
  }
})

app.get('/atores/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/atores/${req.params.id}`)
    res.render('ator', { ator: response.data, date: now() })
  } catch (err) {
    res.status(err.response?.status || 500).render('error', {
      message: `Erro ao obter ator ${req.params.id}`,
      error: err,
      date: now()
    })
  }
})

app.get('/generos', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/generos?_select=id,nome,filmes&_sort=nome`)
    const generos = response.data.map((g) => ({
      ...g,
      nFilmes: Array.isArray(g.filmes) ? g.filmes.length : 0
    }))

    res.render('generos', { generos, date: now() })
  } catch (err) {
    res.status(500).render('error', {
      message: 'Erro ao obter lista de generos',
      error: err,
      date: now()
    })
  }
})

const PORT = 7790
app.listen(PORT, () => {
  console.log(`Servidor de Interface em http://localhost:${PORT}`)
})
