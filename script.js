let cardContainer = document.querySelector(".card-container");
let dados = []; 

async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}
function iniciarBusca() {
    let inputPesquisa = document.querySelector(".search-container input").value;
    let termo = inputPesquisa.toLowerCase();

    let resultadosFiltrados = dados.filter(dado => {
        return dado.nome.toLowerCase().includes(termo) || 
               dado.sinopse.toLowerCase().includes(termo);
    });

    if (resultadosFiltrados.length === 0) {
        cardContainer.innerHTML = "<p style='color: #aaa; padding: 20px; text-align: center;'>Nenhum anime encontrado.</p>";
    } else {
        renderizarCards(resultadosFiltrados);
    }
}

function gerarLinksHTML(linksArray) {
    if (!linksArray || linksArray.length === 0) {
        return '<p class="sem-link" style="color: #666; font-size: 0.8rem;">Indisponível no momento</p>';
    }
    const logos = {
        "crunchyroll": "crun.jpg",
        "netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "primevideo": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
        "hbomax": "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
        "star+": "https://upload.wikimedia.org/wikipedia/commons/7/71/Star%2B_logo.svg",
        "funimation": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Funimation_Logo.svg",
        "default": "https://cdn-icons-png.flaticon.com/512/109/109613.png"
    };

    const linksHTML = linksArray.map(link => {
        let plataformaNome = link.plataforma.toLowerCase().replace(/\s/g, '');
        const iconeUrl = logos[plataformaNome] || logos["default"];
        return `
            <a href="${link.link}" target="_blank" class="plataforma-link" title="Assistir em ${link.plataforma}">
                <img src="${iconeUrl}" alt="${link.plataforma}" class="icone-plataforma">
            </a>
        `;
    });

    return `<div class="links-container">${linksHTML.join('')}</div>`;
}
function renderizarCards(listaDeAnimes) {
    cardContainer.innerHTML = ''; 
    
    for (let dado of listaDeAnimes) {
        let article = document.createElement("article");
        article.classList.add("card");
        
        const linksFormatados = gerarLinksHTML(dado.links_para_assistir);
        const imagemCapa = dado.capa_url || 'https://via.placeholder.com/150x225?text=Sem+Imagem';

        article.innerHTML = `
            <div class="card-capa">
                <img src="${imagemCapa}" alt="Capa do anime ${dado.nome}">
            </div>
            
            <div class="card-info">
                <h2>${dado.nome}</h2> 
                <p class="meta-info"><strong>Ano:</strong> ${dado.ano} | <strong>Autor:</strong> ${dado.autor}</p> 
                <p class="sinopse">${dado.sinopse}</p>
                
                <div class="links-secao">
                    <h4>Onde Assistir:</h4>
                    ${linksFormatados}
                </div>
            </div>
        `;
        
        cardContainer.appendChild(article);
    }
}
carregarDados();