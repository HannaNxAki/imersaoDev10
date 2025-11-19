// Aguarda o conteúdo do DOM ser totalmente carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');

    /**
     * Função assíncrona para buscar os artigos do arquivo JSON.
     * @returns {Promise<Array>} Uma promessa que resolve para um array de artigos.
     */
    async function fetchArticles() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articles = await response.json();
            return articles;
        } catch (error) {
            console.error("Não foi possível buscar os artigos:", error);
            mainElement.innerHTML = '<p style="text-align: center;">Falha ao carregar conteúdo. Tente novamente mais tarde.</p>';
            return []; // Retorna um array vazio em caso de erro
        }
    }

    /**
     * Renderiza os artigos na página.
     * @param {Array} articles - O array de artigos a ser exibido.
     */
    function renderArticles(articles) {
        mainElement.innerHTML = ''; // Limpa o conteúdo principal antes de adicionar os novos artigos
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p><strong>Categoria:</strong> ${article.category}</p>
                <p>${article.content}</p>
            `;
            mainElement.appendChild(articleElement);
        });
    }

    /**
     * Função principal que inicializa a aplicação.
     */
    async function init() {
        const articles = await fetchArticles();
        renderArticles(articles);
    }

    init(); // Inicia a aplicação
});