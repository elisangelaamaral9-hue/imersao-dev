const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const totalInstituicoes = document.getElementById("totalInstituicoes");
const themeToggle = document.getElementById("themeToggle");

let dados = [];
let map;
let markers = [];

const dadosExemplo = [
  {
    nome: "CAPS Infantil",
    descricao: "Serviço público de atenção psicossocial voltado ao cuidado infantil e familiar.",
    endereco: "São Paulo - SP",
    contato: "Procure a unidade CAPS Infantil mais próxima",
    servicos: ["SUS", "Psicologia", "Apoio familiar"],
    link: "#",
    latitude: -23.55052,
    longitude: -46.633308
  },
  {
    nome: "UBS - Unidade Básica de Saúde",
    descricao: "Porta de entrada do SUS para encaminhamentos, avaliações e acompanhamento.",
    endereco: "São Paulo - SP",
    contato: "Atendimento pelo SUS",
    servicos: ["SUS", "Encaminhamento", "Saúde"],
    link: "#",
    latitude: -23.532905,
    longitude: -46.63952
  },
  {
    nome: "Instituição de Apoio ao TEA",
    descricao: "Atendimento, orientação e suporte para famílias de pessoas com TEA.",
    endereco: "São Paulo - SP",
    contato: "Consulte a instituição",
    servicos: ["Autismo", "Terapia", "Família"],
    link: "#",
    latitude: -23.561684,
    longitude: -46.655981
  }
];

async function carregarDados() {
  try {
    const resposta = await fetch("data.json");

    if (!resposta.ok) {
      throw new Error("data.json não encontrado");
    }

    const json = await resposta.json();

    dados = Array.isArray(json) ? json : json.dados || json.instituicoes || dadosExemplo;
  } catch (error) {
    dados = dadosExemplo;
  }

  normalizarDados();
  iniciarInterface();
}

function normalizarDados() {
  dados = dados.map((item, index) => {
    return {
      nome: item.nome || item.titulo || item.name || `Instituição ${index + 1}`,
      descricao: item.descricao || item.description || item.sobre || "Informação não disponível.",
      endereco: item.endereco || item.address || item.local || "Endereço não informado.",
      contato: item.contato || item.telefone || item.email || "Contato não informado.",
      servicos: item.servicos || item.tags || item.especialidades || ["TEA", "Apoio"],
      link: item.link || item.site || item.url || "#",
      latitude: Number(item.latitude || item.lat || -23.55052),
      longitude: Number(item.longitude || item.lng || item.lon || -46.633308)
    };
  });
}

function iniciarInterface() {
  totalInstituicoes.textContent = dados.length;
  criarCards(dados);
  iniciarMapa();
  atualizarMapa(dados);
}

function criarCards(lista) {
  cardsContainer.innerHTML = "";
  resultCount.textContent = `${lista.length} resultado${lista.length === 1 ? "" : "s"}`;

  if (lista.length === 0) {
    cardsContainer.innerHTML = `
      <div class="empty">
        Nenhum resultado encontrado. Tente buscar por outro termo.
      </div>
    `;
    atualizarMapa([]);
    return;
  }

  lista.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const chips = Array.isArray(item.servicos)
      ? item.servicos.slice(0, 4).map(servico => `<span>${servico}</span>`).join("")
      : "";

    card.innerHTML = `
      <h3>${item.nome}</h3>
      <p><strong>Descrição:</strong> ${item.descricao}</p>
      <p><strong>Endereço:</strong> ${item.endereco}</p>
      <p><strong>Contato:</strong> ${item.contato}</p>

      <div class="chips">
        ${chips}
      </div>

      <a href="${item.link}" target="_blank" rel="noopener noreferrer">
        Saiba mais
      </a>
    `;

    cardsContainer.appendChild(card);
  });

  atualizarMapa(lista);
}

function filtrarDados(termo) {
  const busca = termo.toLowerCase().trim();

  if (!busca) {
    criarCards(dados);
    return;
  }

  const filtrados = dados.filter((item) => {
    const texto = `
      ${item.nome}
      ${item.descricao}
      ${item.endereco}
      ${item.contato}
      ${Array.isArray(item.servicos) ? item.servicos.join(" ") : ""}
    `.toLowerCase();

    return texto.includes(busca);
  });

  criarCards(filtrados);
}

searchInput.addEventListener("input", () => {
  filtrarDados(searchInput.value);
});

document.querySelectorAll(".quick-tags button").forEach((button) => {
  button.addEventListener("click", () => {
    const filtro = button.dataset.filter;
    searchInput.value = filtro;
    filtrarDados(filtro);
    document.getElementById("buscar").scrollIntoView({ behavior: "smooth" });
  });
});

function iniciarMapa() {
  map = L.map("map").setView([-23.55052, -46.633308], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

function atualizarMapa(lista) {
  if (!map) return;

  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  lista.forEach((item) => {
    if (!item.latitude || !item.longitude) return;

    const marker = L.marker([item.latitude, item.longitude])
      .addTo(map)
      .bindPopup(`
        <strong>${item.nome}</strong><br>
        ${item.endereco}<br>
        ${item.descricao}
      `);

    markers.push(marker);
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.25));
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

carregarDados();
