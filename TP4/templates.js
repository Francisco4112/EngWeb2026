const pug = require('pug')

function renderPug(fileName, data) {
  return pug.renderFile(`./views/${fileName}.pug`, data)
}

exports.emdListPage = (lista, d) => renderPug('index', { lista: lista, date: d })
exports.emdPage = (emd, d) => renderPug('emd', { emd: emd, date: d })
exports.emdFormPage = (emd, d) => renderPug('form', { emd: emd, date: d })
exports.emdStatsPage = (stats, d) => renderPug('stats', { stats: stats, date: d })
