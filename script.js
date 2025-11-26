// lista de produtos
const produtos = [
  { id: 1, nome: "Água Sanitária", categoria: "limpeza", preco: 6.50, img: "img/256905-1.webp" },
  { id: 2, nome: "Desinfetante", categoria: "limpeza", preco: 5.20, img: "img/desinfetante-casa-e-perfume-roxo-sensualidad-500ml.jpg" },
  { id: 3, nome: "Sabonete Líquido OMO 3L", categoria: "limpeza", preco: 60.00, img: "img/sabão-líquido-omo-lavagem-perfeita.jpg"},
  { id: 4, nome: "Arroz 5kg", categoria: "comida", preco: 22.90, img: "img/332852-urbano-branco-5kg.png" },
  { id: 5, nome: "Feijão", categoria: "comida", preco: 8.70, img: "img/Kicaldo-feijaocarioca.png" },
  { id: 6, nome: "Macarrão Espaguete", categoria: "comida", preco: 10.00, img: "img/6571bf24558925a4e8897fb2.webp"},
  { id: 7, nome: "Refrigerante 2L", categoria: "bebida", preco: 7.50, img: "img/Refrigerante-Coca-Cola-sabor-original-2l-gelada.jpg.webp" },
  { id: 8, nome: "Água Mineral 1.5L", categoria: "bebida", preco: 3.40, img: "img/7896445490116.webp" },
  { id: 9, nome: "Suco Natural 2L", categoria: "bebida", preco: 20.00, img: "img/suco_integral_laranja_natural_one_garrafa_2l_6f25acb6-3841-4478-8fea-2c2141de359e.png"}
];

let carrinho = [];

const listaProdutos = document.getElementById("listaProdutos");
const itensCarrinho = document.getElementById("itensCarrinho");
const painelCarrinho = document.getElementById("painelCarrinho");
const botaoAbrirCarrinho = document.getElementById("botaoAbrirCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const popupArea = document.getElementById("popupArea");
const mensagemFinal = document.getElementById("mensagemFinal");

// mostra os produtos na tela
carregarProdutos();

function carregarProdutos(filtro = produtos) {
  listaProdutos.innerHTML = "";
  filtro.forEach(p => {
    const bloco = document.createElement("article");
    bloco.className = "cartao";
    bloco.innerHTML = `
      <div class="thumb">
        <img src="${p.img}" alt="${p.nome}">
      </div>
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>

      <div style="display:flex; gap:8px">
        <button class="botaoAdicionar" onclick="adicionarCarrinho(${p.id}, this)">Adicionar</button>
        <button class="botaoRemover" onclick="tirarDoCarrinho(${p.id})">Remover</button>
      </div>
    `;
    listaProdutos.appendChild(bloco);
  });
}

// filtra categorias
function filtrar(tipo, botao) {
  document.querySelectorAll(".botaoCategoria").forEach(b => b.classList.remove("ativa"));
  botao.classList.add("ativa");

  if (tipo === "tudo") return carregarProdutos(produtos);

  const filtrado = produtos.filter(p => p.categoria === tipo);
  carregarProdutos(filtrado);
}

// adiciona produto no carrinho
function adicionarCarrinho(id, botao) {
  const item = produtos.find(p => p.id === id);
  const jaTem = carrinho.find(p => p.id === id);

  if (jaTem) jaTem.qtd += 1;
  else carrinho.push({ ...item, qtd: 1 });

  atualizarCarrinho();

  // animação simples no botão
  if (botao) {
    botao.style.transform = "scale(0.92)";
    setTimeout(() => botao.style.transform = "scale(1)", 150);
  }
}

// remove 1 unidade
function tirarDoCarrinho(id) {
  const pos = carrinho.findIndex(i => i.id === id);
  if (pos === -1) return;

  carrinho[pos].qtd -= 1;

  if (carrinho[pos].qtd <= 0) carrinho.splice(pos, 1);

  atualizarCarrinho();
}

// diminui usando o botão ➖ no carrinho
function diminuir(id) {
  const pos = carrinho.findIndex(i => i.id === id);
  if (pos === -1) return;

  carrinho[pos].qtd -= 1;

  if (carrinho[pos].qtd <= 0) carrinho.splice(pos, 1);

  atualizarCarrinho();
}

// atualiza carrinho na tela
function atualizarCarrinho() {
  itensCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = `<li style="color:#777">Carrinho vazio.</li>`;
    totalCarrinho.textContent = "Total: R$ 0.00";
    return;
  }

  let total = 0;

  carrinho.forEach(item => {
    total += item.preco * item.qtd;

    const li = document.createElement("li");
    li.className = "itemCarrinho";

    li.innerHTML = `
      <div>
        <strong>${item.nome}</strong>
        <div style="font-size:13px;color:#666">
          R$ ${item.preco.toFixed(2)} x ${item.qtd}
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:5px;">
        <button onclick="diminuir(${item.id})" style="background:none;border:none;cursor:pointer;font-size:16px">➖</button>
        <button onclick="adicionarCarrinho(${item.id})" style="background:none;border:none;cursor:pointer;font-size:16px">➕</button>
      </div>
    `;

    itensCarrinho.appendChild(li);
  });

  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// abre/fecha carrinho
botaoAbrirCarrinho.addEventListener("click", e => {
  e.stopPropagation();
  painelCarrinho.classList.add("aberto");
});

// botão fechar na janela
function fecharCarrinho() {
  painelCarrinho.classList.remove("aberto");
}

// não fecha quando clicar dentro
document.addEventListener("click", e => {
  const clicouDentro = painelCarrinho.contains(e.target);
  const clicouBotao = botaoAbrirCarrinho.contains(e.target);
  const clicouQtd = e.target.closest(".itemCarrinho");

  if (!clicouDentro && !clicouBotao && !clicouQtd) {
    fecharCarrinho();
  }
});

// popup
function abrirPopup() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio.");
    return;
  }

  popupArea.classList.add("mostrar");
}

function fecharPopup() {
  popupArea.classList.remove("mostrar");
}

// finaliza pedido
function confirmarFinalizar() {
  const nome = document.getElementById("nomeCliente").value.trim();
  if (!nome) return alert("Digite seu nome.");

  const pedido = JSON.stringify(carrinho);

  fetch("salvar_pedido.php", {
    method: "POST",
    headers: { "Content-Type":"application/x-www-form-urlencoded" },
    body: `nome=${encodeURIComponent(nome)}&pedido=${encodeURIComponent(pedido)}`
  })
  .then(() => {
    fecharPopup();
    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
    mostrarMensagemFinal();
    document.getElementById("nomeCliente").value = "";
  })
  .catch(() => alert("Erro ao salvar pedido."));
}

// aparece aviso de concluído
function mostrarMensagemFinal() {
  mensagemFinal.classList.add("mostrar");
  setTimeout(() => mensagemFinal.classList.remove("mostrar"), 2500);
}