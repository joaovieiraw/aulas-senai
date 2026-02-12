function mostrarSecao(id) {
    document.querySelectorAll('.secao').forEach(sec => {
        sec.classList.remove('ativa');
    });
    document.getElementById(id).classList.add('ativa');
}

function carregarNoticias() {
    let noticias = JSON.parse(localStorage.getItem("noticias")) || [];
    let lista = document.getElementById("listaNoticias");
    lista.innerHTML = "";

    noticias.forEach(n => {
        lista.innerHTML += `
            <div class="card-noticia">
                <h3>${n.titulo}</h3>
                <p>${n.conteudo}</p>
            </div>
        `;
    });
}

carregarNoticias();
