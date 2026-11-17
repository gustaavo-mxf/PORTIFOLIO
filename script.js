// Interações DOM do portfólio
"use strict";

const botaoTema = document.querySelector("#tema");
const listaProjetos = document.querySelector("#lista-projetos");
const mensagemVazia = document.querySelector("#mensagem-vazia");
const ano = document.querySelector("#ano");

// Alterna o tema usando uma classe CSS.
botaoTema.addEventListener("click", () => {
  const ativouTemaEscuro = document.body.classList.toggle("escuro");
  botaoTema.setAttribute("aria-pressed", String(ativouTemaEscuro));
  botaoTema.textContent = ativouTemaEscuro ? "Ativar tema claro" : "Alternar tema";
});

// Filtros acessíveis: os botões são criados no DOM e podem ser usados pelo teclado.
const areaFiltros = document.createElement("div");
areaFiltros.className = "filtros";
areaFiltros.setAttribute("aria-label", "Filtrar projetos por categoria");
areaFiltros.innerHTML = `
  <button class="filtro ativo" type="button" data-filtro="todos" aria-pressed="true">Todos</button>
  <button class="filtro" type="button" data-filtro="web" aria-pressed="false">Web</button>
  <button class="filtro" type="button" data-filtro="hardware" aria-pressed="false">Hardware</button>
  <button class="filtro" type="button" data-filtro="software" aria-pressed="false">Software</button>`;
listaProjetos.before(areaFiltros);

const estiloFiltros = document.createElement("style");
estiloFiltros.textContent = `
.filtros{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
.filtro{border:1px solid var(--borda);border-radius:22px;padding:7px 14px;background:var(--fundo);color:var(--texto);font:inherit;cursor:pointer}
.filtro.ativo,.filtro:focus-visible{background:var(--azul2);color:white;outline:2px solid var(--azul)}
.card .remover{align-self:flex-start;margin-top:12px;border:1px solid var(--borda);border-radius:20px;padding:6px 12px;background:var(--fundo);color:var(--texto);cursor:pointer}
.card .remover:focus-visible{outline:3px solid var(--azul);outline-offset:2px}`;
document.head.append(estiloFiltros);

// Aplica data-categoria e hidden para exibir somente a categoria escolhida.
areaFiltros.addEventListener("click", (evento) => {
  const filtro = evento.target.closest("button[data-filtro]");
  if (!filtro || !areaFiltros.contains(filtro)) return;
  const categoria = filtro.dataset.filtro;
  areaFiltros.querySelectorAll("button").forEach((botao) => {
    const selecionado = botao === filtro;
    botao.classList.toggle("ativo", selecionado);
    botao.setAttribute("aria-pressed", String(selecionado));
  });
  listaProjetos.querySelectorAll(".card").forEach((card) => {
    card.hidden = categoria !== "todos" && card.dataset.categoria !== categoria;
  });
  atualizarMensagemVazia();
});

// Cada card recebe um botão de remoção. A delegação também atende cards novos.
function prepararBotaoRemover(card) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "remover";
  botao.textContent = "Remover projeto";
  botao.setAttribute("aria-label", `Remover ${card.querySelector("h3").textContent}`);
  card.append(botao);
}
listaProjetos.querySelectorAll(".card").forEach(prepararBotaoRemover);

listaProjetos.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button.remover");
  if (!botao || !listaProjetos.contains(botao)) return;
  botao.closest(".card").remove();
  atualizarMensagemVazia();
});

function atualizarMensagemVazia() {
  const cardsVisiveis = [...listaProjetos.querySelectorAll(".card")].some((card) => !card.hidden);
  mensagemVazia.hidden = cardsVisiveis;
}

// Cadastro de projetos: submit + FormData + createElement + textContent.
const formulario = document.createElement("form");
formulario.id = "form-projeto";
formulario.className = "form-projeto";
formulario.innerHTML = `
  <h3>Adicionar projeto</h3>
  <label for="titulo-projeto">Título do projeto</label>
  <input id="titulo-projeto" name="titulo" type="text" maxlength="70" required>
  <label for="categoria-projeto">Categoria</label>
  <select id="categoria-projeto" name="categoria" required>
    <option value="web">Web</option>
    <option value="hardware">Hardware</option>
    <option value="software">Software</option>
  </select>
  <button class="botao-cadastrar" type="submit">Cadastrar projeto</button>
  <p class="retorno-form" role="status" aria-live="polite"></p>`;
document.querySelector("#projetos").append(formulario);

const estiloFormulario = document.createElement("style");
estiloFormulario.textContent = `
.form-projeto{margin-top:24px;padding:20px;border:1px solid var(--borda);border-radius:14px;display:grid;gap:9px;max-width:520px}
.form-projeto label{font-weight:bold;color:var(--azul)}
.form-projeto input,.form-projeto select{padding:10px;border:1px solid var(--borda);border-radius:8px;background:var(--fundo);color:var(--texto);font:inherit}
.botao-cadastrar{justify-self:start;padding:9px 16px;border:0;border-radius:22px;background:#173575;color:white;font:inherit;font-weight:bold;cursor:pointer}
.botao-cadastrar:focus-visible{outline:3px solid var(--azul);outline-offset:3px}`;
document.head.append(estiloFormulario);

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!formulario.reportValidity()) return;
  const dados = new FormData(formulario);
  const titulo = String(dados.get("titulo")).trim();
  const categoria = String(dados.get("categoria"));
  if (!titulo) return;

  const card = document.createElement("article");
  card.classList.add("card");
  card.dataset.categoria = categoria;

  const etiqueta = document.createElement("span");
  etiqueta.classList.add("etiqueta");
  etiqueta.textContent = categoria[0].toUpperCase() + categoria.slice(1);

  const tituloCard = document.createElement("h3");
  tituloCard.textContent = titulo;

  const descricao = document.createElement("p");
  descricao.textContent = "Projeto adicionado ao portfólio.";

  const tecnologias = document.createElement("p");
  tecnologias.className = "tecnologias";
  tecnologias.textContent = "Cadastro realizado pelo formulário.";

  card.append(etiqueta, tituloCard, descricao, tecnologias);
  prepararBotaoRemover(card);
  listaProjetos.append(card);
  formulario.reset();
  formulario.querySelector(".retorno-form").textContent = "Projeto cadastrado com sucesso.";
  atualizarMensagemVazia();
  // Ao cadastrar, retorna à visualização de todos os projetos.
  areaFiltros.querySelector('[data-filtro="todos"]').click();
});

ano.textContent = new Date().getFullYear();
console.log("Portfólio interativo carregado sem erros.");
