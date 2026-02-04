import json, os, shutil

## json.load -> pegar os dados
## json.dump() -> salvar os dados

def open_json(fileName):
    with open(fileName, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data
    
def mk_dir(relative_path):
    if not os.path.exists(relative_path):
        os.mkdir(relative_path)
    else:
        shutil.rmtree(relative_path)
        os.mkdir(relative_path)    

def new_file(fileName, content):
    with open(fileName, 'w', encoding='utf-8') as f:
        f.write(content)

## -------------- Script Principal --------------

dataset_reparacoes = open_json('dataset_reparacoes.json')        

html = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reparações</title>
    </head>
    <body>
        <h3>Reparações</h3>
        <ul>
            <li> <a href="reparacoes.html">Reparacoes</a></li>
            <li> <a href="tiposIntervencoes.html">Tipos de Intervenções</a></li>
            <li> <a href="informacoesCarros.html">Informações de Carros</a></li>
        </ul>
    </body>    
    </html>
"""
mk_dir("output")
new_file("./output/index.html", html)



reparacoes_linha = []
intervencoes_unicas = dict()
informacoesCarros_linha = dict()

for reparacao in dataset_reparacoes['reparacoes']:
    nome = reparacao['nome']
    nif = reparacao['nif']
    data = reparacao['data']
    marca = reparacao['viatura']['marca']
    modelo = reparacao['viatura']['modelo']
    matricula = reparacao['viatura']['matricula']
    nr_intervencoes = reparacao['nr_intervencoes']

## -------- Tipos de intervençoes --------------

    for intervencao in reparacao['intervencoes']:
        codigo = intervencao['codigo']

        if codigo not in intervencoes_unicas:
            intervencoes_unicas[codigo] = {
                "codigo": codigo,
                "nome": intervencao["nome"],
                "descricao": intervencao["descricao"],
                "reparacoes": []
            }

        intervencoes_unicas[codigo]["reparacoes"].append({
            "data": data,
            "nif": nif,
            "nome": nome,
            "marca": marca,
            "modelo": modelo,
            "nr_intervencoes": nr_intervencoes
        })

## -------- Reparaçoes --------------    

    reparacoes_linha.append({
        "data": data,
        "nif": nif,
        "nome": nome,
        "marca": marca,
        "modelo": modelo,
        "nr_intervencoes": nr_intervencoes
    })

## -------- Informações de Carros --------------

    chave_carro = (marca, modelo)
    if chave_carro not in informacoesCarros_linha:
        informacoesCarros_linha[chave_carro] = {
            "marca": marca,
            "modelo": modelo,
            "numero_carros": 0
        }
    informacoesCarros_linha[chave_carro]["numero_carros"] += 1

for intervencao in intervencoes_unicas.values():
    codigo = intervencao["codigo"]

    linhas = ""
    for r in sorted(intervencao["reparacoes"], key=lambda x: x["data"], reverse=True):
        linhas += f"""
        <tr>
            <td>{r['data']}</td>
            <td>{r['nif']}</td>
            <td>{r['nome']}</td>
            <td>{r['marca']}</td>
            <td>{r['modelo']}</td>
            <td>{r['nr_intervencoes']}</td>
        </tr>
        """

    html = f"""
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Reparações - Intervenção {codigo}</title>
        </head>
        <body>
            <h3>Reparações - Intervenção {codigo}</h3>
            <table border="1">
                <tr>
                    <th>Data</th>
                    <th>NIF</th>
                    <th>Nome</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Número de Intervenções</th>
                </tr>
                {linhas}
            </table>
            <p><a href="tiposIntervencoes.html">Voltar</a></p>
        </body>
    </html>
    """
    new_file(f"./output/reparacoes_intervencao_{codigo}.html", html)


reparacoes = "".join(
    f"""
                <tr>
                    <td>{x['data']}</td>
                    <td>{x['nif']}</td>
                    <td>{x['nome']}</td>
                    <td>{x['marca']}</td>
                    <td>{x['modelo']}</td>
                    <td>{x['nr_intervencoes']}</td>
                </tr>"""
    for x in sorted(reparacoes_linha, key=lambda x: x["data"], reverse=True)
)

tiposIntervencoes = "".join(
    f"""
    <tr>
        <td>{x['codigo']}</td>
        <td>{x['nome']}</td>
        <td>{x['descricao']}</td>
        <td><a href="reparacoes_intervencao_{x['codigo']}.html">Ver Reparações</a></td>
    </tr>"""
    for x in sorted(intervencoes_unicas.values(), key=lambda x: x["codigo"])
)

informacoesCarros = "".join(
    f"""
        <tr>
            <td>{x['marca']}</td>
            <td>{x['modelo']}</td>
            <td>{x['numero_carros']}</td>
        </tr>"""
    for x in sorted(informacoesCarros_linha.values(), key=lambda x: (x['marca'], x['modelo']))
)

## ----------------- Pagina de Reparações -----------------

## Preciso de Data, nif, nome, marca, modelo, número de intervenções realizadas;

## página com toda a informação de uma reparação;

html = f"""
    <html>
        <head> 
            <meta charset="UTF-8">
            <title>Dados Reparações</title>
        </head>
        <body>
            <h3>Dados Reparações</h3>
            <table border="1">
                <tr>
                    <th>Data</th>
                    <th>NIF</th>
                    <th>Nome</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Número de Intervenções</th>
                </tr>
                {reparacoes}
            </table>
            <p><a href="index.html">Voltar</a></p>
        </body>
    </html>
"""
new_file("./output/reparacoes.html", html)


## ----------------- Pagina de Tipos de Intervenções -----------------

## Preciso de lista alfabética de código das intervenções - código, nome e descrição;

## dados da intervenção (código, nome e descrição) e lista de reparações onde foi realizada;

html = f"""
    <html>
        <head> 
            <meta charset="UTF-8">
            <title>Dados Tipos de Intervenções</title>
        </head>
        <body>
            <h3>Dados Tipos de Intervenções</h3>
            <table border="1">
                <tr>
                    <th>Código</th>
                    <th>Nome da Intervenção</th>
                    <th>Descrição</th>
                    <th>Lista de Reparações</th>
                </tr>
                {tiposIntervencoes}
            </table>
            <p><a href="index.html">Voltar</a></p>
        </body>
    </html>
"""
new_file("./output/tiposIntervencoes.html", html)

## ----------------- Pagina de Informações de Carros -----------------

## Preciso de lista alfabética das marcas e modelos dos carros reparados - marca, modelo, número de carros;

## idem...

html = f"""
    <html>
        <head> 
            <meta charset="UTF-8">
            <title>Dados Informações de Carros</title>
        </head>
        <body>
            <h3>Dados Informações de Carros</h3>
            <table border="1">
                <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Número de Carros</th>
                </tr>
                {informacoesCarros}
            </table>
            <p><a href="index.html">Voltar</a></p>
        </body>
    </html>
"""
new_file("./output/informacoesCarros.html", html)
