const dados = [
  {
    nome: "Centro de Referência em Autismo",
    descricao: "Atendimento especializado e orientação para famílias de pessoas com TEA.",
    endereco: "São Paulo - SP",
    contato: "Consulte a unidade responsável",
    link: "#",
    latitude: -23.55052,
    longitude: -46.633308
  },
  {
    nome: "CAPS Infantil",
    descricao: "Serviço público de atenção psicossocial voltado ao atendimento infantil e familiar.",
    endereco: "Diversas regiões de São Paulo",
    contato: "Procure a unidade CAPS Infantil mais próxima",
    link: "#",
    latitude: -23.561684,
    longitude: -46.655981
  },
  {
    nome: "UBS - Unidade Básica de Saúde",
    descricao: "Porta de entrada para encaminhamentos, avaliações e acompanhamento pelo SUS.",
    endereco: "São Paulo - SP",
    contato: "Atendimento pelo SUS",
    link: "#",
    latitude: -23.532905,
    longitude: -46.63952
  }
];

const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");

function criarCards(lista) {
  cardsContainer.innerHTML = "";

  if (lista.length === 0) {
    cardsContainer.innerHTML = `
      <div class="no-results">
        Nenhum resultado encontrado. Tente buscar por outro termo.
      </div>
    `;
    return;
  }

  lista.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${item.nome}</h3>
      <p><strong>Descrição:</strong> ${item.descricao}</p>
      <p><strong>Endereço:</strong> ${item.endereco}</p>
      <p><strong>Contato:</strong> ${item.contato}</p>
      <a href="${item.link}" target="_blank">Saiba mais</a>
    `;

    cardsContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const termo = searchInput.value.toLowerCase();

  const filtrados = dados.filter(item =>
    item.nome.toLowerCase().includes(termo) ||
    item.descricao.toLowerCase().includes(termo) ||
    item.endereco.toLowerCase().includes(termo) ||
    item.contato.toLowerCase().includes(termo)
  );

  criarCards(filtrados);
});

criarCards(dados);

const map = L.map("map").setView([-23.55052, -46.633308], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

dados.forEach(item => {
  L.marker([item.latitude, item.longitude])
    .addTo(map)
    .bindPopup(`
      <strong>${item.nome}</strong><br>
      ${item.endereco}<br>
      ${item.descricao}
    `);
});
