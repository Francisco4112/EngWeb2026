var url = require('url');
var http = require('http');
const axios = require('axios');

function renderTable(headers, rows) {
  let html = '<table border="1"><tr>';
  headers.forEach(h => {
    html += '<th>' + h + '</th>';
  });
  html += '</tr>';
  rows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => {
      html += '<td>' + cell + '</td>';
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
}

var myServer = http.createServer(function(req, res) {
  const q = url.parse(req.url, true).pathname;

  if (q == '/reparacoes') {
    axios.get('http://localhost:3000/reparacoes')
        .then((resp) => {
          const headers = [
            'nome', 'nif', 'data', 'viatura (marca)', 'viatura (modelo)',
            'viatura (matricula)', 'nr_intervencoes', 'intervencoes'
          ];
          const rows = resp.data.map(
              rep => ([
                rep.nome, rep.nif, rep.data,
                rep.viatura ? rep.viatura.marca : '',
                rep.viatura ? rep.viatura.modelo : '',
                rep.viatura ? rep.viatura.matricula : '', rep.nr_intervencoes,
                rep.intervencoes ?
                    rep.intervencoes.map(i => i.nome).join(', ') :
                    ''
              ]));
          const html = renderTable(headers, rows);
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.end(html);
        })
        .catch(error => {
          res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
          res.end('<pre>' + JSON.stringify(error) + '</pre>');
        });
  } else if (q == '/intervencoes') {
    axios.get('http://localhost:3000/reparacoes')
        .then((resp) => {
          const counts = {};
          resp.data.forEach(rep => {
            (rep.intervencoes || []).forEach(interv => {
              const key = interv.codigo + '|' + interv.nome;
              if (!counts[key]) {
                counts[key] = {
                  codigo: interv.codigo,
                  nome: interv.nome,
                  descricao: interv.descricao,
                  total: 0
                };
              }
              counts[key].total += 1;
            });
          });
          const headers = ['codigo', 'nome', 'descricao', 'total'];
          const rows =
              Object.values(counts)
                  .sort((a, b) => a.codigo.localeCompare(b.codigo))
                  .map(i => ([i.codigo, i.nome, i.descricao, i.total]));
          const html = renderTable(headers, rows);
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.end(html);
        })
        .catch(error => {
          res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
          res.end('<pre>' + JSON.stringify(error) + '</pre>');
        });
  } else if (q == '/viaturas') {
    axios.get('http://localhost:3000/reparacoes')
        .then((resp) => {
          const counts = {};
          resp.data.forEach(rep => {
            if (!rep.viatura) return;
            const key = rep.viatura.marca + '|' + rep.viatura.modelo;
            if (!counts[key]) {
              counts[key] = {
                marca: rep.viatura.marca,
                modelo: rep.viatura.modelo,
                total: 0
              };
            }
            counts[key].total += 1;
          });
          const headers = ['marca', 'modelo', 'total_reparacoes'];
          const rows =
              Object.values(counts)
                  .sort((a, b) => {
                    const m = a.marca.localeCompare(b.marca);
                    return m != 0 ? m : a.modelo.localeCompare(b.modelo);
                  })
                  .map(v => ([v.marca, v.modelo, v.total]));
          const html = renderTable(headers, rows);
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.end(html);
        })
        .catch(error => {
          res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
          res.end('<pre>' + JSON.stringify(error) + '</pre>');
        });
  } else {
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(
        '<h3>Serviços disponíveis</h3>' +
        '<ul>' +
        '<li><a href="/reparacoes">/reparacoes</a></li>' +
        '<li><a href="/intervencoes">/intervencoes</a></li>' +
        '<li><a href="/viaturas">/viaturas</a></li>' +
        '</ul>');
  }
});

myServer.listen(7777);
console.log('Servidor rodando em http://localhost:7777');
