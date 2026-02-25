# TP4 - Registos EMD

## Metainformação
- Título: TP4  
- Data: 25/02/2026  
- Autor: Francisco Barbosa  
- UC: Engenharia Web

---

## Autor
- ID: A107286  
- Nome: Francisco Miguel Dourado Barbosa  
- Fotografia:  
  ![Francisco](../francisco.jpg)

---

## Resumo
Este trabalho implementa um servidor aplicacional em Node.js para gestão de
registos de Exames Médicos Desportivos (EMD), consumindo dados de um
`json-server`.

O dataset foi preparado em `emd.json` com recurso ao script `parser.py`
(normalização de campos e uso de `id` em vez de `_id`).

Foram implementadas páginas de:
- listagem de EMDs;
- detalhe de um EMD;
- registo de novo EMD;
- edição e remoção de EMD;
- estatísticas por sexo, modalidade, clube, resultado e federado.

Foi seguido o formato-base da pasta `Semana4/TP4/Exemplo`.

---

## Lista de Resultados
- `Semana4/TP4/Exercicio/emd.json`
- `Semana4/TP4/Exercicio/parser.py`
- `Semana4/TP4/Exercicio/servidor.js`
- `Semana4/TP4/Exercicio/static.js`
- `Semana4/TP4/Exercicio/templates.js`
- `Semana4/TP4/Exercicio/views/layout.pug`
- `Semana4/TP4/Exercicio/views/index.pug`
- `Semana4/TP4/Exercicio/views/emd.pug`
- `Semana4/TP4/Exercicio/views/form.pug`
- `Semana4/TP4/Exercicio/views/stats.pug`

---
