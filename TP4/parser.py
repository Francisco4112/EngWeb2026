import json
import sys
from pathlib import Path


def transformar_registo(registo: dict) -> None:
    if "_id" in registo and "id" not in registo:
        registo["id"] = registo["_id"]
    registo.pop("_id", None)

    nome = registo.get("nome")
    if not isinstance(nome, dict):
        return

    primeiro = str(nome.get("primeiro", "")).strip()
    ultimo = str(nome.get("último", "")).strip()
    completo = " ".join(parte for parte in [primeiro, ultimo] if parte)

    registo["nome"] = completo


def transformar_dados(dados):
    if isinstance(dados, list):
        for registo in dados:
            if isinstance(registo, dict):
                transformar_registo(registo)
    elif isinstance(dados, dict):
        if "emds" in dados and isinstance(dados["emds"], list):
            for registo in dados["emds"]:
                if isinstance(registo, dict):
                    transformar_registo(registo)
        else:
            transformar_registo(dados)
    return dados


def main():
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("emd.json")
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else input_path

    with input_path.open("r", encoding="utf-8") as f:
        dados = json.load(f)

    dados_transformados = transformar_dados(dados)

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(dados_transformados, f, ensure_ascii=False, indent=2)

    print(f"Transformação concluída: {output_path}")


if __name__ == "__main__":
    main()
