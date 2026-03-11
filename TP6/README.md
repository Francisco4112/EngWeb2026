# TP6 - App sobre cinema americano com Docker

## Conteudo
- `db.json`: dataset base com 3 listas (`filmes`, `atores`, `generos`)
- `api_dados/`: API minimalista (Express + MongoDB)
- `interface/`: servidor aplicacional HTML (Express + Pug)
- `docker-compose.yml`: orquestracao dos 3 servicos

## Endpoints da interface
- `GET /filmes`
- `GET /filmes/:id`
- `GET /atores`
- `GET /atores/:id`
- `GET /generos`

## API de dados
- `GET /filmes`
- `GET /filmes/:id`
- `GET /atores`
- `GET /atores/:id`
- `GET /generos`
- `GET /generos/:id`

## Arranque com Docker
```bash
cd TP6
docker compose up -d --build
```

Interface:
- `http://localhost:7790/filmes`

## Notas de carga Mongo
No arranque do container MongoDB, o script `api_dados/mongo-init/import.sh` importa:
- `api_dados/filmes.json`
- `api_dados/atores.json`
- `api_dados/generos.json`

A base de dados usada e `cinema`.
