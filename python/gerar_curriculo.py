"""Gera currículo simples para Jovem Aprendiz (formatação ABNT),
seguindo o modelo "Empregabilidade - Aula 2 - Curriculo".

Edite o bloco DADOS abaixo para cada aluno e rode:
    python gerar_curriculo.py
Seções com lista vazia ([]) são omitidas.
"""
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING

# ===== DADOS DO ALUNO =====
DADOS = {
    "nome": "NOME COMPLETO DO ALUNO",
    "contato": "Cidade – UF | (00) 00000-0000 | email@exemplo.com | 15 anos",
    "objetivo": "Jovem Aprendiz",
    # cada item: (título, período, [atividades])
    "experiencia": [
        ("Experiência informal", "", [
            "Ajuda em atividades do dia a dia, com responsabilidade e organização.",
        ]),
    ],
    # cada item: (curso, escola, situação)
    "formacao": [
        ("Ensino Médio – cursando", "[Nome da escola]", "[Série] – período [manhã/tarde/noite]"),
    ],
    "cursos": [],  # ex.: "Informática Essencial – CEBRAC – 2025"
    "habilidades": [
        "Vontade de aprender",
        "Interesse em desenvolver habilidades profissionais",
        "Disposição para novas oportunidades",
        "Comprometimento",
    ],
    "adicionais": [
        "Disponibilidade no contraturno escolar",
        "Primeiro emprego",
    ],
    "arquivo": "Curriculo_Nome_Aluno.docx",
}
# ==========================

doc = Document()
s = doc.sections[0]
s.page_width, s.page_height = Cm(21), Cm(29.7)  # A4
s.top_margin, s.left_margin = Cm(3), Cm(3)
s.bottom_margin, s.right_margin = Cm(2), Cm(2)

st = doc.styles["Normal"]
st.font.name = "Arial"
st.font.size = Pt(12)
pf = st.paragraph_format
pf.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
pf.space_before = Pt(0)
pf.space_after = Pt(0)


def par(text="", bold=False, align=WD_ALIGN_PARAGRAPH.LEFT, size=None):
    p = doc.add_paragraph()
    p.alignment = align
    if text:
        r = p.add_run(text)
        r.bold = bold
        if size:
            r.font.size = Pt(size)
    return p


def titulo(text):
    par()
    par(text, bold=True)


def lista(itens):
    for i in itens:
        p = par("•  " + i)
        p.paragraph_format.left_indent = Cm(0.6)


par(DADOS["nome"], bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, size=14)
par(DADOS["contato"], align=WD_ALIGN_PARAGRAPH.CENTER)

titulo("OBJETIVO PROFISSIONAL")
par(DADOS["objetivo"])

if DADOS["experiencia"]:
    titulo("EXPERIÊNCIA PROFISSIONAL")
    for nome, periodo, atividades in DADOS["experiencia"]:
        par(nome, bold=True)
        if periodo:
            par(periodo)
        lista(atividades)

titulo("FORMAÇÃO")
for curso, escola, situacao in DADOS["formacao"]:
    par(curso, bold=True)
    par(escola)
    par(situacao)

if DADOS["cursos"]:
    titulo("CURSOS COMPLEMENTARES")
    lista(DADOS["cursos"])

titulo("HABILIDADES")
lista(DADOS["habilidades"])

if DADOS["adicionais"]:
    titulo("INFORMAÇÕES ADICIONAIS")
    lista(DADOS["adicionais"])

doc.save(DADOS["arquivo"])
print("Gerado:", DADOS["arquivo"])
