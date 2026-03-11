#!/bin/bash
set -e

mongoimport --host localhost --db cinema --collection filmes --type json --file /docker-entrypoint-initdb.d/filmes.json --jsonArray
mongoimport --host localhost --db cinema --collection atores --type json --file /docker-entrypoint-initdb.d/atores.json --jsonArray
mongoimport --host localhost --db cinema --collection generos --type json --file /docker-entrypoint-initdb.d/generos.json --jsonArray

mongosh cinema --eval 'db.filmes.createIndex({id: 1}, {unique: true}); db.atores.createIndex({id: 1}, {unique: true}); db.generos.createIndex({id: 1}, {unique: true});'
