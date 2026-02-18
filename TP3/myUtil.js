const axios = require('axios')

const API = 'http://localhost:3000'

function pagina(titulo, corpo) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${titulo}</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
      </head>
      <body class="w3-light-grey">
        <div class="w3-container w3-teal">
          <h1>${titulo}</h1>
        </div>
        <div class="w3-container w3-margin-top">
          ${corpo}
        </div>
      </body>
    </html>
  `
}

function link(href, texto) {
  return `<a href="${href}">${texto}</a>`
}

function tabela(headers, rows) {
  return `
    <table class="w3-table w3-striped w3-bordered w3-hoverable w3-white">
      <tr class="w3-light-grey">
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
      ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
    </table>
  `
}

async function getAlunos() {
  const resp = await axios.get(`${API}/alunos`)
  return resp.data
}

async function getCursos() {
  const resp = await axios.get(`${API}/cursos`)
  return resp.data
}

async function getInstrumentos() {
  const resp = await axios.get(`${API}/instrumentos`)
  return resp.data
}

module.exports = {
  pagina,
  link,
  tabela,
  getAlunos,
  getCursos,
  getInstrumentos
}
