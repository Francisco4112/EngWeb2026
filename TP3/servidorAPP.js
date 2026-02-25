const http = require('http')
const util = require('./myUtil')

http.createServer(async function(req, res) {
      const now = new Date().toISOString().substring(0, 16)
      console.log(`${req.method} ${req.url} ${now}`)

      if (req.method !== 'GET') {
        res.writeHead(405, {'Content-Type': 'text/html; charset=utf-8'})
        return res.end(`<p>Método ${req.method} não suportado.</p>`)
      }

      if (req.url === '/') {
        const html = `
      <div class="w3-card-4 w3-white">
        <header class="w3-container w3-teal">
          <h3>Serviços disponíveis</h3>
        </header>
        <div class="w3-container w3-padding">
          <ul class="w3-ul">
            <li>${util.link('/alunos', '/alunos')}</li>
            <li>${util.link('/cursos', '/cursos')}</li>
            <li>${util.link('/instrumentos', '/instrumentos')}</li>
          </ul>
        </div>
      </div>
    `
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        return res.end(util.pagina('Escola de Música', html))
      }

      if (req.url === '/alunos') {
        try {
          const alunos = await util.getAlunos()
          const rows = alunos.map(
              a =>
                  [a.id, a.nome, a.dataNasc, a.curso, a.anoCurso,
                   a.instrumento])
          const table = util.tabela(
              ['ID', 'Nome', 'Data Nasc.', 'Curso', 'Ano Curso', 'Instrumento'],
              rows)
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
          return res.end(util.pagina('Alunos', table))
        } catch (e) {
          res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
          return res.end('<p>Erro ao obter alunos.</p>')
        }
      }

      if (req.url === '/cursos') {
        try {
          const cursos = await util.getCursos()
          const rows = cursos.map(
              c =>
                  [c.id, c.designacao, c.duracao,
                   c.instrumento ?
                       `${c.instrumento.id} - ${c.instrumento['#text']}` :
                       ''])
          const table =
              util.tabela(['ID', 'Designação', 'Duração', 'Instrumento'], rows)
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
          return res.end(util.pagina('Cursos', table))
        } catch (e) {
          res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
          return res.end('<p>Erro ao obter cursos.</p>')
        }
      }

      if (req.url === '/instrumentos') {
        try {
          const instrumentos = await util.getInstrumentos()
          const rows = instrumentos.map(i => [i.id, i['#text']])
          const table = util.tabela(['ID', 'Instrumento'], rows)
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
          return res.end(util.pagina('Instrumentos', table))
        } catch (e) {
          res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
          return res.end('<p>Erro ao obter instrumentos.</p>')
        }
      }

      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
      res.end('<p>Rota não suportada.</p>')
    })
    .listen(3001)

console.log('Servidor aplicacional à escuta na porta 3001...')
