document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector(".card-container");
    const searchInput = document.getElementById('searchInput');
    let todosOsDados = []; // Variável para armazenar todos os dados carregados

    // Inicializa o mapa e define sua visão inicial para as coordenadas de São Paulo
    const map = L.map('map').setView([-23.55052, -46.633308], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Cria uma camada de grupo para os marcadores, que será limpa a cada busca
    const markerGroup = L.layerGroup().addTo(map);

    async function IniciarBusca() {
        try {
            const resposta = await fetch("date.json");
            if (!resposta.ok) {
                throw new Error(`Erro ao buscar dados: ${resposta.statusText}`);
            }
            const dados = await resposta.json();
            todosOsDados = dados; // Armazena os dados na variável
            renderizarConteudo(todosOsDados); // Renderiza todos os dados inicialmente
        } catch (error) {
            console.error("Não foi possível carregar os dados:", error);
        }
    }

    function renderizarConteudo(dados) {
        container.innerHTML = ''; // Limpa o container antes de adicionar novos cards
        markerGroup.clearLayers(); // Limpa todos os marcadores antigos do mapa

        // Verifica se a busca não retornou resultados
        if (dados.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Nenhum resultado encontrado.';
            noResultsMessage.classList.add('no-results-message');
            container.appendChild(noResultsMessage);
            return; // Encerra a função aqui, pois não há cards para renderizar
        }

        for (const dado of dados) {
            // Renderiza o card
            const article = document.createElement("article");
            article.classList.add("card");
            article.innerHTML = `
                <h2>${dado.nome}</h2>
                <p>${dado.descricao}</p>
                <p><b>Contato:</b> ${dado.contato}</p>
                <p><b>Endereço:</b> ${dado.endereco}</p>
                <a href="${dado.link}" target="_blank">Saiba mais</a>
            `;
            container.appendChild(article);

            // Adiciona o marcador no mapa, se tiver coordenadas
            if (dado.lat && dado.lng) {
                L.marker([dado.lat, dado.lng]).addTo(markerGroup)
                    .bindPopup(`<b>${dado.nome}</b><br>${dado.endereco}`);
            }
        }
    }

    // Adiciona o evento de 'input' para o campo de busca
    searchInput.addEventListener('input', () => {
        const termoBusca = searchInput.value.toLowerCase();
        const dadosFiltrados = todosOsDados.filter(dado =>
            dado.nome.toLowerCase().includes(termoBusca) ||
            dado.descricao.toLowerCase().includes(termoBusca) ||
            dado.endereco.toLowerCase().includes(termoBusca)
        );
        renderizarConteudo(dadosFiltrados);
    });

    IniciarBusca();
});