# Gerador de Currículo – CEBRAC

© 2026 **Prof. Valderi Ramos** · CEBRAC – Todos os direitos reservados.

Site para alunos montarem um currículo simples de **Jovem Aprendiz**, nas normas da ABNT, e baixarem em **Word (.docx)** ou **PDF**.

Não precisa instalar nada: abre no navegador, no computador ou no celular.

## Funcionalidades

- Formulário passo a passo: dados pessoais, objetivo, formação, experiência, cursos, habilidades e informações adicionais
- Pré-visualização da folha A4 em tempo real
- Botão **Baixar Word (.docx)** com formatação ABNT
- Botão **Salvar PDF / Imprimir** (pelo navegador, em "Salvar como PDF")
- Sugestões prontas de habilidades e informações adicionais (é só clicar)
- Máscara de telefone e aviso de campos obrigatórios ou incompletos
- Rascunho salvo automaticamente no navegador
- Botão **Preencher exemplo** para mostrar em sala de aula
- Contador público de currículos gerados, no topo do site. Usa o serviço gratuito [Abacus](https://abacus.jasoncameron.dev) e conta cada clique em Word ou PDF. Ao abrir o site no próprio computador (localhost), ele usa um contador de teste separado.
- **Privacidade:** os dados do aluno ficam só no navegador dele. O contador envia apenas "+1", sem nenhuma informação pessoal.

## Formatação ABNT aplicada

| Item | Valor |
|---|---|
| Papel | A4 |
| Margens | superior e esquerda 3 cm; inferior e direita 2 cm |
| Fonte | Arial 12 (nome em 14, negrito) |
| Espaçamento | 1,5 entre linhas |
| Títulos | MAIÚSCULAS e negrito |

## Publicar no GitHub Pages (grátis)

1. Crie um repositório novo no GitHub, por exemplo `gerador-curriculo`.
2. Envie os arquivos `index.html`, `style.css`, `app.js`, `README.md`, `.gitignore` e a pasta `python/`.
3. No repositório, vá em **Settings → Pages**.
4. Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
5. Depois de 1 ou 2 minutos, o site fica disponível em
   `https://SEU-USUARIO.github.io/gerador-curriculo/`

Mande esse link para os alunos.

## Estrutura

```
index.html      página com o formulário e a prévia
style.css       visual do site e formatação da folha A4 / impressão
app.js          lógica: prévia, validação, Word e PDF
python/         versão em script Python (alternativa offline)
```

## Versão em Python (opcional)

Para gerar o Word pelo terminal, sem usar o site:

```bash
cd python
pip install -r requirements.txt
python gerar_curriculo.py
```

Edite o bloco `DADOS` dentro de `gerar_curriculo.py` antes de rodar.

> **Atenção:** não envie para o GitHub o script preenchido com dados reais de alunos (nome, telefone, e-mail). Os arquivos `.docx` gerados já estão no `.gitignore`.

## Tecnologias

- HTML, CSS e JavaScript puro
- [docx](https://www.npmjs.com/package/docx) 8.5.0, para gerar o arquivo Word no navegador
- [python-docx](https://pypi.org/project/python-docx/), na versão em Python
