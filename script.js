document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const searchInput = document.getElementById('caixa-busca');
    const searchButton = document.getElementById('botao-busca');
    let allArticlesData = [];

    // Carrega os dados do JSON e renderiza os artigos iniciais
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allArticlesData = data;
            renderArticles(allArticlesData);
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    /**
     * Gera o HTML para as estrelas de avaliação.
     * @param {number} rating - A nota do jogo (0 a 5).
     * @returns {string} O HTML com os SVGs das estrelas.
     */
    function generateStars(rating) {
        if (!rating || rating === 0) return ''; // Não mostra estrelas se a nota for 0 ou indefinida

        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
        }
        if (halfStar) {
            starsHTML += '<svg viewBox="0 0 24 24"><path d="M12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4zM22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z"/></svg>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<svg viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';
        }
        return starsHTML;
    }

    /**
     * Renderiza uma lista de artigos no container principal.
     * @param {Array} articles - O array de objetos de artigo a ser renderizado.
     */
    function renderArticles(articles) {
        articlesContainer.innerHTML = ''; // Limpa os artigos existentes
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p style="text-align: center;">Nenhum resultado encontrado.</p>';
            return;
        }

        articles.forEach(item => {
            const wrapperElement = document.createElement('div');
            wrapperElement.className = 'article-wrapper';

            const articleElement = document.createElement('article');
            articleElement.innerHTML = `
                <img src="${item.coverImage}" alt="" class="background-image">
                <img src="${item.coverImage}" alt="Capa do jogo ${item.title}" class="game-cover-main">
                <div class="article-content">
                    <div class="article-header">
                        <h2>${item.title}</h2>
                        <div class="title-meta">
                            <span class="year-badge">${item.year}</span>
                            ${item.rating > 0 ? `
                                <div class="star-rating">${generateStars(item.rating)}</div>
                                <span class="rating-text">${item.rating.toFixed(1)}/5</span>
                            ` : ''}
                        </div>
                    </div>
                    <p><strong>Categoria:</strong> ${item.category}</p>
                    <p>${item.content}</p>
                    <div class="article-footer">
                        <p><strong>Tags:</strong> ${item.tags.join(', ')}</p>
                        <a href="${item.source}" target="_blank" rel="noopener noreferrer" class="source-link">Saiba mais</a>
                    </div>
                </div>
            `;

            wrapperElement.appendChild(articleElement);
            articlesContainer.appendChild(wrapperElement);
        });
    }

    /**
     * Filtra e renderiza os artigos com base no termo de busca.
     */
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            renderArticles(allArticlesData); // Mostra todos se a busca estiver vazia
            return;
        }

        const filteredArticles = allArticlesData.filter(item => {
            const title = item.title.toLowerCase();
            const category = item.category.toLowerCase();
            const content = item.content.toLowerCase();
            const tags = item.tags.join(' ').toLowerCase();

            return title.includes(searchTerm) ||
                   category.includes(searchTerm) ||
                   content.includes(searchTerm) ||
                   tags.includes(searchTerm);
        });

        renderArticles(filteredArticles);
    }

    // Adiciona o evento de clique ao botão de busca
    searchButton.addEventListener('click', performSearch);

    // Opcional: busca em tempo real enquanto o usuário digita
    searchInput.addEventListener('input', performSearch);
});