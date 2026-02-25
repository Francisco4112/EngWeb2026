/*
    Module Static - to serve static resources in public folder
*/

var fs = require('fs')
var path = require('path')

function staticResource(request) {
  var urlPath = request.url.split('?')[0]
  return /\/w3.css$/.test(urlPath) ||
    /\/favicon.ico$/.test(urlPath)
}

exports.staticResource = staticResource

function serveStaticResource(req, res) {
  var urlPath = req.url.split('?')[0]
  var partes = urlPath.split('/')
  var file = partes[partes.length - 1]
  var staticPath = path.join(__dirname, 'public', file)

  fs.readFile(staticPath, (erro, dados) => {
    if (erro) {
      console.log('Erro: ficheiro não encontrado ' + erro)
      res.statusCode = 404
      res.end('Erro: ficheiro não encontrado ' + erro)
    } else {
      if (file == 'w3.css') {
        res.setHeader('Content-Type', 'text/css')
      } else if (file == 'favicon.ico') {
        res.setHeader('Content-Type', 'image/x-icon')
      }
      res.end(dados)
    }
  })
}

exports.serveStaticResource = serveStaticResource
