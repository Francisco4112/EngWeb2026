import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INPUT_FILE = ROOT / 'cinema.json'
OUTPUT_FILE = ROOT / 'db.json'


def build_db(data):
    filmes_raw = data.get('filmes', [])

    actor_map = {}
    genre_map = {}
    actor_counter = 1
    genre_counter = 1

    filmes = []

    for i, film in enumerate(filmes_raw, start=1):
        fid = f'f{i}'
        title = film.get('title', '').strip()
        year = film.get('year', 0)
        cast_names = [c.strip() for c in film.get('cast', []) if str(c).strip()]
        genre_names = [g.strip() for g in film.get('genres', []) if str(g).strip()]

        cast = []
        for name in cast_names:
            if name not in actor_map:
                actor_map[name] = {
                    'id': f'a{actor_counter}',
                    'nome': name,
                    'filmes': []
                }
                actor_counter += 1
            actor = actor_map[name]
            actor['filmes'].append({'id': fid, 'title': title, 'year': year})
            cast.append({'id': actor['id'], 'nome': name})

        genres = []
        for name in genre_names:
            if name not in genre_map:
                genre_map[name] = {
                    'id': f'g{genre_counter}',
                    'nome': name,
                    'filmes': []
                }
                genre_counter += 1
            genre = genre_map[name]
            genre['filmes'].append({'id': fid, 'title': title, 'year': year})
            genres.append({'id': genre['id'], 'nome': name})

        filmes.append({
            'id': fid,
            'title': title,
            'year': year,
            'cast': cast,
            'genres': genres
        })

    atores = sorted(actor_map.values(), key=lambda a: a['nome'])
    generos = sorted(genre_map.values(), key=lambda g: g['nome'])

    return {
        'filmes': filmes,
        'atores': atores,
        'generos': generos
    }


def main():
    with INPUT_FILE.open('r', encoding='utf-8') as f:
        data = json.load(f)

    out = build_db(data)

    with OUTPUT_FILE.open('w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f'Ficheiro gerado: {OUTPUT_FILE}')
    print(f"Filmes: {len(out['filmes'])}")
    print(f"Atores: {len(out['atores'])}")
    print(f"Géneros: {len(out['generos'])}")


if __name__ == '__main__':
    main()
