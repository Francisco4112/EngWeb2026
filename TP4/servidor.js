// servidor.js
// EW2025

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring')

var templates = require('./templates.js')
var static = require('./static.js')

function collectRequestBodyData(request, callback) {
  if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
    let body = ''
    request.on('data', chunk => {
      body += chunk.toString()
    })
    request.on('end', () => {
      callback(parse(body))
    })
  } else {
    callback(null)
  }
}

function strToBool(v) {
  return v === true || v === 'true' || v === '1' || v === 'on' || v === 'sim'
}

function normalizeEmd(input, forceId) {
  var rid = forceId || input.id || input._id
  return {
    id: rid,
    index: Number(input.index || 0),
    dataEMD: input.dataEMD || '',
    nome: input.nome || '',
    idade: Number(input.idade || 0),
    'género': input['género'] || '',
    morada: input.morada || '',
    modalidade: input.modalidade || '',
    clube: input.clube || '',
    email: input.email || '',
    federado: strToBool(input.federado),
    resultado: strToBool(input.resultado)
  }
}

function countBy(list, mapper) {
  var out = {}
  list.forEach(e => {
    var key = mapper(e)
    out[key] = (out[key] || 0) + 1
  })
  return out
}

var emdServer = http.createServer((req, res) => {
  var d = new Date().toISOString().substring(0, 16)
  var urlObj = new URL(req.url, 'http://localhost:7777')
  var pathname = urlObj.pathname
  console.log(req.method + ' ' + req.url + ' ' + d)

  if (static.staticResource(req)) {
    static.serveStaticResource(req, res)
    return
  }

  switch (req.method) {
    case 'GET':
      if (pathname == '/' || pathname == '/emd') {
        var ord = urlObj.searchParams.get('ord')
        var apiUrl = 'http://localhost:3000/emds?_sort=nome&_order=asc'
        if (ord == 'dataDesc') apiUrl = 'http://localhost:3000/emds?_sort=dataEMD&_order=desc'
        if (ord == 'nomeAsc') apiUrl = 'http://localhost:3000/emds?_sort=nome&_order=asc'

        axios.get(apiUrl)
          .then(resp => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(templates.emdListPage(resp.data, d))
          })
          .catch(erro => {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write('<p>Não foi possível obter a lista de EMDs...</p>')
            res.write('<p>' + erro + '</p>')
            res.end('<address><a href="/emd">Voltar</a></address>')
          })
      } else if (pathname == '/emd/registo') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(templates.emdFormPage(null, d))
      } else if (pathname == '/emd/stats') {
        axios.get('http://localhost:3000/emds')
          .then(resp => {
            var lista = resp.data
            var stats = {
              sexo: countBy(lista, e => e['género'] || 'N/D'),
              modalidade: countBy(lista, e => e.modalidade || 'N/D'),
              clube: countBy(lista, e => e.clube || 'N/D'),
              resultado: countBy(lista, e => e.resultado ? 'Apto' : 'Inapto'),
              federado: countBy(lista, e => e.federado ? 'Sim' : 'Não')
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(templates.emdStatsPage(stats, d))
          })
          .catch(erro => {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write('<p>Não foi possível gerar as estatísticas...</p>')
            res.write('<p>' + erro + '</p>')
            res.end('<address><a href="/emd">Voltar</a></address>')
          })
      } else if (/\/emd\/editar\/[0-9a-zA-Z_]+$/.test(pathname)) {
        var editId = pathname.split('/')[3]

        axios.get('http://localhost:3000/emds?id=' + editId)
          .then(resp => {
            if (!resp.data || resp.data.length == 0) {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end('<p>EMD não encontrado.</p><address><a href="/emd">Voltar</a></address>')
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end(templates.emdFormPage(resp.data[0], d))
            }
          })
          .catch(erro => {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write('<p>Não foi possível obter o registo para edição...</p>')
            res.write('<p>' + erro + '</p>')
            res.end('<address><a href="/emd">Voltar</a></address>')
          })
      } else if (/\/emd\/apagar\/[0-9a-zA-Z_]+$/.test(pathname)) {
        var delId = pathname.split('/')[3]

        axios.get('http://localhost:3000/emds?id=' + delId)
          .then(r => {
            if (!r.data || r.data.length == 0) throw new Error('EMD não encontrado.')
            var rec = r.data[0]
            var resourceId = rec.id ? rec.id : delId
            return axios.delete('http://localhost:3000/emds/' + resourceId)
          })
          .then(_r => {
            res.writeHead(302, { 'Location': '/emd' })
            res.end()
          })
          .catch(erro => {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write('<p>Não foi possível apagar o registo...</p>')
            res.write('<p>' + erro + '</p>')
            res.end('<address><a href="/emd">Voltar</a></address>')
          })
      } else if (/\/emd\/[0-9a-zA-Z_]+$/.test(pathname)) {
        var idEMD = pathname.split('/')[2]

        axios.get('http://localhost:3000/emds?id=' + idEMD)
          .then(resp => {
            if (!resp.data || resp.data.length == 0) {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end('<p>EMD não encontrado.</p><address><a href="/emd">Voltar</a></address>')
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end(templates.emdPage(resp.data[0], d))
            }
          })
          .catch(erro => {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write('<p>Não foi possível obter o registo...</p>')
            res.write('<p>' + erro + '</p>')
            res.end('<address><a href="/emd">Voltar</a></address>')
          })
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<p>Rota GET não suportada.</p><address><a href="/emd">Voltar</a></address>')
      }
      break

    case 'POST':
      if (pathname == '/emd') {
        collectRequestBodyData(req, result => {
          if (result) {
            axios.get('http://localhost:3000/emds?_sort=index&_order=desc&_limit=1')
              .then(r => {
                var lastIndex = (r.data && r.data.length) ? Number(r.data[0].index || 0) : -1
                var newId = Date.now().toString(16) + Math.floor(Math.random() * 1000).toString(16)
                var novo = normalizeEmd(result, newId)
                novo.index = lastIndex + 1
                return axios.post('http://localhost:3000/emds', novo)
              })
              .then(_resp => {
                res.writeHead(302, { 'Location': '/emd' })
                res.end()
              })
              .catch(erro => {
                res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' })
                res.write('<p>Não foi possível inserir o registo...</p>')
                res.write('<p>' + erro + '</p>')
                res.end('<address><a href="/emd">Voltar</a></address>')
              })
          } else {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<p>Body inválido.</p><address><a href="/emd">Voltar</a></address>')
          }
        })
      } else if (/\/emd\/[0-9a-zA-Z_]+$/.test(pathname)) {
        var upId = pathname.split('/')[2]
        collectRequestBodyData(req, result => {
          if (result) {
            axios.get('http://localhost:3000/emds?id=' + upId)
              .then(r => {
                if (!r.data || r.data.length == 0) throw new Error('EMD não encontrado.')
                var rec = r.data[0]
                var resourceId = rec.id ? rec.id : upId
                var alterado = normalizeEmd(result, upId)
                if (rec.id) alterado.id = rec.id
                return axios.put('http://localhost:3000/emds/' + resourceId, alterado)
              })
              .then(_resp => {
                res.writeHead(302, { 'Location': '/emd' })
                res.end()
              })
              .catch(erro => {
                res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' })
                res.write('<p>Não foi possível alterar o registo...</p>')
                res.write('<p>' + erro + '</p>')
                res.end('<address><a href="/emd">Voltar</a></address>')
              })
          } else {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<p>Body inválido.</p><address><a href="/emd">Voltar</a></address>')
          }
        })
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<p>Rota POST não suportada.</p><address><a href="/emd">Voltar</a></address>')
      }
      break

    default:
      res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end('<p>Método não suportado.</p>')
      break
  }
})

emdServer.listen(7777, () => {
  console.log('Servidor à escuta na porta 7777...')
})
