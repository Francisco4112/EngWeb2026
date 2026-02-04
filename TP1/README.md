# Título do Manifesto

## Metainformação
- Título: TP1  
- Data: 04/02/2026  
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
- Desenvolvimento de um script em Python (`json2html.py`) que lê o ficheiro `dataset_reparacoes.json` e gera automaticamente um mini-site estático em `output/`.
- Implementação de funções auxiliares para leitura de JSON, criação/limpeza da pasta de saída e escrita de ficheiros HTML.
- Extração e organização dos dados de reparações para produzir:
  - uma página geral com todas as reparações ordenadas por data decrescente;
  - uma página com os tipos de intervenção (código, nome e descrição), com links para páginas específicas por intervenção;
  - uma página com informação agregada por marca/modelo, incluindo o número de carros reparados.
- Criação de páginas individuais por intervenção (`reparacoes_intervencao_<codigo>.html`) com a lista das reparações correspondentes.
- Geração de uma página inicial (`index.html`) com navegação para todas as páginas produzidas.

---

## Lista de Resultados
- json2html.py
- dataset_reparacoes.json


