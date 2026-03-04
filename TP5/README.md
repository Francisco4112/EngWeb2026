# TP5 - Cinema (Express + json-server)

## Metainformação
- Título: TP5
- Data: 04/03/2026
- Autor: Francisco Barbosa
- UC: Engenharia Web

## Resumo
Aplicação web em Express com Pug, alimentada por `json-server`, para explorar um dataset de filmes.

Foi criado um parser em Python que transforma `cinema.json` num `db.json` com três coleções:
- `filmes` (com id, título, ano, elenco e géneros);
- `atores` (com id, nome e lista de filmes);
- `generos` (com id, nome e lista de filmes).

## Execução
1. Instalar dependências:
```bash
npm install
```

2. Gerar a base para o `json-server`:
```bash
npm run build-db
```

3. Terminal 1: iniciar API (`json-server`):
```bash
npm run db
```

4. Terminal 2: iniciar aplicação web:
```bash
npm start
```

5. Abrir no browser:
- `http://localhost:7777/`

## Ficheiros principais
- `parser.py`
- `servidor.js`
- `views/*.pug`
- `public/w3.css`
- `db.json` (gerado)
