// Gerador de Currículo – Jovem Aprendiz
// Tudo roda no navegador: o rascunho fica no localStorage e nada é enviado.

const CHAVE = "curriculo-jovem-aprendiz";
const form = document.getElementById("form");
const folha = document.getElementById("folha");
const escala = document.querySelector(".folha-escala");
const previa = document.getElementById("previa");
const listaExp = document.getElementById("experiencias");
const tplExp = document.getElementById("tpl-exp");
const aviso = document.getElementById("aviso");

const EXEMPLO = {
  nome: "Ana Clara Souza Lima",
  idade: "15",
  cidade: "Cascavel – PR",
  telefone: "(45) 99999-0000",
  recados: "",
  email: "anaclara.lima@email.com",
  objetivo: "Jovem Aprendiz",
  curso: "Ensino Médio",
  situacao: "cursando",
  escola: "Colégio Estadual Exemplo",
  serie: "1º ano",
  turno: "manhã",
  experiencias: [
    {
      titulo: "Experiência informal – Ajudante em loja da família",
      periodo: "2024 – atual",
      atividades: "Atendimento a clientes\nOrganização de produtos nas prateleiras",
    },
  ],
  cursos: "Informática Essencial – CEBRAC – 2025",
  habilidades: "Vontade de aprender\nComunicação\nTrabalho em equipe\nResponsabilidade",
  adicionais: "Disponibilidade no contraturno escolar\nPrimeiro emprego",
};

// ---------- utilidades ----------

const linhas = (txt) => (txt || "").split("\n").map((s) => s.trim()).filter(Boolean);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function mascaraTel(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? "(" + d : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function nomeArquivo(d) {
  const base = (d.nome || "Curriculo")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/).slice(0, 3).join("_");
  return "Curriculo_" + (base || "Aluno");
}

// ---------- leitura / escrita do formulário ----------

function lerDados() {
  const fd = new FormData(form);
  const d = Object.fromEntries(fd.entries());
  d.experiencias = [...listaExp.querySelectorAll(".exp")].map((el) => {
    const e = {};
    el.querySelectorAll("[data-k]").forEach((c) => (e[c.dataset.k] = c.value));
    return e;
  });
  return d;
}

function preencher(d) {
  for (const el of form.elements) {
    if (el.name && el.name in d) el.value = d[el.name];
  }
  listaExp.innerHTML = "";
  (d.experiencias || []).forEach(addExp);
}

function addExp(e = {}) {
  const el = tplExp.content.firstElementChild.cloneNode(true);
  el.querySelectorAll("[data-k]").forEach((c) => (c.value = e[c.dataset.k] || ""));
  el.querySelector(".btn-rem").addEventListener("click", () => {
    el.remove();
    atualizar();
  });
  listaExp.appendChild(el);
}

// ---------- montagem do conteúdo (usado pela prévia e pelo Word) ----------

function montar(d) {
  const contato = [
    d.cidade,
    d.telefone,
    d.recados && `${d.recados} (recados)`,
    d.email,
    d.idade && `${d.idade} anos`,
  ].filter(Boolean);

  const formacao = {
    titulo: [d.curso, d.situacao].filter(Boolean).join(" – "),
    escola: d.escola,
    detalhe: [d.serie, d.turno && `período da ${d.turno}`].filter(Boolean).join(" – "),
  };
  if (d.turno === "noite") formacao.detalhe = formacao.detalhe.replace("período da noite", "período noturno");
  if (d.turno === "integral") formacao.detalhe = formacao.detalhe.replace("período da integral", "período integral");

  const exps = (d.experiencias || [])
    .map((e) => ({ titulo: e.titulo?.trim(), periodo: e.periodo?.trim(), atividades: linhas(e.atividades) }))
    .filter((e) => e.titulo || e.atividades.length);

  return {
    nome: (d.nome || "").trim().toUpperCase(),
    contato,
    objetivo: (d.objetivo || "").trim() || "Jovem Aprendiz",
    exps,
    formacao,
    cursos: linhas(d.cursos),
    habilidades: linhas(d.habilidades),
    adicionais: linhas(d.adicionais),
  };
}

// ---------- prévia ----------

function renderPrevia(c) {
  const lista = (itens) => `<ul>${itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  let h = "";
  h += `<p class="nome">${c.nome ? esc(c.nome) : '<span class="vazio">SEU NOME COMPLETO</span>'}</p>`;
  h += `<p class="contato">${c.contato.length ? c.contato.map(esc).join(" | ") : '<span class="vazio">Cidade | telefone | e-mail</span>'}</p>`;

  h += `<h2>Objetivo profissional</h2><p>${esc(c.objetivo)}</p>`;

  if (c.exps.length) {
    h += `<h2>Experiência profissional</h2>`;
    for (const e of c.exps) {
      h += `<div class="bloco">`;
      if (e.titulo) h += `<h3>${esc(e.titulo)}</h3>`;
      if (e.periodo) h += `<p>${esc(e.periodo)}</p>`;
      if (e.atividades.length) h += lista(e.atividades);
      h += `</div>`;
    }
  }

  h += `<h2>Formação</h2><h3>${esc(c.formacao.titulo)}</h3>`;
  if (c.formacao.escola) h += `<p>${esc(c.formacao.escola)}</p>`;
  if (c.formacao.detalhe) h += `<p>${esc(c.formacao.detalhe)}</p>`;

  if (c.cursos.length) h += `<h2>Cursos complementares</h2>${lista(c.cursos)}`;
  if (c.habilidades.length) h += `<h2>Habilidades</h2>${lista(c.habilidades)}`;
  if (c.adicionais.length) h += `<h2>Informações adicionais</h2>${lista(c.adicionais)}`;

  folha.innerHTML = h;
  ajustarEscala();
}

function ajustarEscala() {
  if (getComputedStyle(previa).display === "none") return;
  const larg = previa.clientWidth;
  const s = Math.min(1, larg / folha.offsetWidth);
  escala.style.transform = `scale(${s})`;
  escala.style.height = folha.offsetHeight * s + "px";
}

// ---------- chips de sugestão ----------

function atualizarChips() {
  document.querySelectorAll(".chips").forEach((box) => {
    const atuais = linhas(form.elements[box.dataset.alvo].value).map((s) => s.toLowerCase());
    box.querySelectorAll("button").forEach((b) => b.classList.toggle("usado", atuais.includes(b.textContent.toLowerCase())));
  });
}

document.querySelectorAll(".chips").forEach((box) => {
  box.addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    const campo = form.elements[box.dataset.alvo];
    const itens = linhas(campo.value);
    const i = itens.findIndex((s) => s.toLowerCase() === b.textContent.toLowerCase());
    if (i >= 0) itens.splice(i, 1);
    else itens.push(b.textContent);
    campo.value = itens.join("\n");
    atualizar();
  });
});

// ---------- validação ----------

function validar() {
  const faltando = [];
  form.querySelectorAll("[required]").forEach((el) => {
    const ok = el.value.trim() && el.checkValidity();
    el.classList.toggle("invalido", !ok);
    if (!ok) faltando.push(el.closest("label").firstChild.textContent.replace("*", "").trim());
  });
  const tel = form.elements.telefone.value.replace(/\D/g, "");
  if (tel && tel.length < 10) {
    form.elements.telefone.classList.add("invalido");
    faltando.push("Telefone (está faltando dígito)");
  }
  aviso.textContent = faltando.length ? "Confira: " + faltando.join(", ") : "";
  if (faltando.length) {
    if (layout.dataset.modo === "previa") document.querySelector('.aba[data-alvo="form"]').click();
    form.querySelector(".invalido")?.focus();
  }
  return !faltando.length;
}

// ---------- Word (.docx) ----------

async function baixarWord() {
  if (!validar()) return;
  if (!window.docx) {
    aviso.textContent = "Não foi possível carregar o gerador de Word. Verifique a internet e recarregue a página.";
    return;
  }
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = window.docx;
  const d = lerDados();
  const c = montar(d);
  const cm = (v) => Math.round(v * 567); // 1 cm ≈ 567 twips

  const p = (texto, op = {}) =>
    new Paragraph({
      alignment: op.centro ? AlignmentType.CENTER : AlignmentType.LEFT,
      indent: op.item ? { left: cm(1.2), hanging: cm(0.5) } : undefined,
      children: [new TextRun({ text: (op.item ? "•\t" : "") + texto, bold: op.negrito, size: op.tam })],
      tabStops: op.item ? [{ type: "left", position: cm(1.2) }] : undefined,
    });
  const vazio = () => new Paragraph({ children: [] });
  const titulo = (t) => [vazio(), p(t.toUpperCase(), { negrito: true })];
  const itens = (arr) => arr.map((i) => p(i, { item: true }));

  const corpo = [
    p(c.nome, { negrito: true, centro: true, tam: 28 }),
    p(c.contato.join(" | "), { centro: true }),
    ...titulo("Objetivo profissional"),
    p(c.objetivo),
  ];
  if (c.exps.length) {
    corpo.push(...titulo("Experiência profissional"));
    c.exps.forEach((e, i) => {
      if (i) corpo.push(vazio());
      if (e.titulo) corpo.push(p(e.titulo, { negrito: true }));
      if (e.periodo) corpo.push(p(e.periodo));
      corpo.push(...itens(e.atividades));
    });
  }
  corpo.push(...titulo("Formação"), p(c.formacao.titulo, { negrito: true }));
  if (c.formacao.escola) corpo.push(p(c.formacao.escola));
  if (c.formacao.detalhe) corpo.push(p(c.formacao.detalhe));
  if (c.cursos.length) corpo.push(...titulo("Cursos complementares"), ...itens(c.cursos));
  if (c.habilidades.length) corpo.push(...titulo("Habilidades"), ...itens(c.habilidades));
  if (c.adicionais.length) corpo.push(...titulo("Informações adicionais"), ...itens(c.adicionais));

  const doc = new Document({
    creator: "Gerador de Currículo – Jovem Aprendiz",
    title: "Currículo – " + c.nome,
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 24 }, // 12 pt
          paragraph: { spacing: { line: 360, before: 0, after: 0 } }, // 1,5
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: cm(3), left: cm(3), bottom: cm(2), right: cm(2) },
          },
        },
        children: corpo,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nomeArquivo(d) + ".docx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- PDF (impressão do navegador) ----------

function salvarPdf() {
  if (!validar()) return;
  const tituloOriginal = document.title;
  document.title = nomeArquivo(lerDados()); // vira o nome sugerido do PDF
  window.print();
  document.title = tituloOriginal;
}

// ---------- rascunho ----------

function salvarRascunho(d) {
  try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch {}
}
function lerRascunho() {
  try { return JSON.parse(localStorage.getItem(CHAVE)); } catch { return null; }
}

// ---------- ligação dos eventos ----------

function atualizar() {
  const d = lerDados();
  renderPrevia(montar(d));
  atualizarChips();
  salvarRascunho(d);
}

form.addEventListener("input", (ev) => {
  if (ev.target.classList.contains("tel")) ev.target.value = mascaraTel(ev.target.value);
  if (ev.target.classList.contains("invalido")) ev.target.classList.remove("invalido");
  atualizar();
});
form.addEventListener("change", atualizar);

document.getElementById("add-exp").addEventListener("click", () => {
  addExp();
  listaExp.lastElementChild.querySelector("input").focus();
  atualizar();
});
document.getElementById("btn-exemplo").addEventListener("click", () => {
  preencher(EXEMPLO);
  aviso.textContent = "";
  atualizar();
});
document.getElementById("btn-limpar").addEventListener("click", () => {
  if (!confirm("Apagar tudo o que foi preenchido?")) return;
  form.reset();
  listaExp.innerHTML = "";
  form.querySelectorAll(".invalido").forEach((el) => el.classList.remove("invalido"));
  aviso.textContent = "";
  atualizar();
});
document.getElementById("btn-word").addEventListener("click", baixarWord);
document.getElementById("btn-pdf").addEventListener("click", salvarPdf);

// abas (celular)
const layout = document.querySelector(".layout");
layout.dataset.modo = "form";
document.querySelectorAll(".aba").forEach((aba) =>
  aba.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach((a) => a.classList.toggle("ativa", a === aba));
    layout.dataset.modo = aba.dataset.alvo;
    window.scrollTo(0, 0);
    ajustarEscala();
  })
);

window.addEventListener("resize", ajustarEscala);

// início
const rascunho = lerRascunho();
if (rascunho) preencher(rascunho);
else form.elements.habilidades.value = "Vontade de aprender";
atualizar();
