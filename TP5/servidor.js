const express = require('express')
const axios = require('axios')
const path = require('path')

const app = express()
const PORT = 7777
const JSON_SERVER = 'http://localhost:3000'

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.locals.date = new Date().toISOString().substring(0, 16)
  next()
})

  app.get(['/', '/filmes'], async (req, res) => {
    try {
      const resp =
          await axios.get(`${JSON_SERVER}/filmes?_sort=title&_order=asc`)
      res.render('filmes', {lista: resp.data, title: 'Lista de Filmes'})
    } catch (e) {
      res.status(500).render('error', {title: 'Erro', error: e})
    }
  })

  app.get('/filmes/:id', async (req, res) => {
    try {
      const resp = await axios.get(`${JSON_SERVER}/filmes/${req.params.id}`)
      res.render('filme', {filme: resp.data, title: `Filme ${resp.data.id}`})
    } catch (e) {
      res.status(404).render('error', {title: 'Filme não encontrado', error: e})
    }
  })

  app.get('/atores', async (req, res) => {
    try {
      const resp =
          await axios.get(`${JSON_SERVER}/atores?_sort=nome&_order=asc`)
      res.render('atores', {lista: resp.data, title: 'Lista de Atores'})
    } catch (e) {
      res.status(500).render('error', {title: 'Erro', error: e})
    }
  })

  app.get('/atores/:id', async (req, res) => {
    try {
      const resp = await axios.get(`${JSON_SERVER}/atores/${req.params.id}`)
      res.render('ator', {ator: resp.data, title: `Ator ${resp.data.id}`})
    } catch (e) {
      res.status(404).render('error', {title: 'Ator não encontrado', error: e})
    }
  })

  app.get('/generos', async (req, res) => {
    try {
      const resp =
          await axios.get(`${JSON_SERVER}/generos?_sort=nome&_order=asc`)
      res.render('generos', {lista: resp.data, title: 'Lista de Géneros'})
    } catch (e) {
      res.status(500).render('error', {title: 'Erro', error: e})
    }
  })

  app.get('/generos/:id', async (req, res) => {
    try {
      const resp = await axios.get(`${JSON_SERVER}/generos/${req.params.id}`)
      res.render('genero', {genero: resp.data, title: `Género ${resp.data.id}`})
    } catch (e) {
      res.status(404).render(
          'error', {title: 'Género não encontrado', error: e})
    }
  })

  app.use((req, res) => {res.status(404).render('error', {
            title: 'Rota não encontrada',
            error: {message: 'Rota não suportada'}
          })})

  app.listen(PORT, () => {console.log(`Servidor web na porta ${PORT}...`)})
