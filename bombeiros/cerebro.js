
let equipes = [
    { nome: "Equipe Alfa", plantao: "Segunda", disponivel: true },
    { nome: "Equipe Bravo", plantao: "Terça", disponivel: true },
    { nome: "Equipe Charlie", plantao: "Quarta", disponivel: false }
];

let ocorrencias = [];

function renderizarEquipes() {
    const lista = document.getElementById("lista-equipes");
    const select = document.getElementById("selectEquipe");
    lista.innerHTML = "";
    select.innerHTML = '<option value="">Selecione uma equipe disponível</option>';

    equipes.forEach((equipe, index) => {
        const div = document.createElement("div");
        div.className = "card";

        const status = equipe.disponivel ? "Disponível" : "Indisponível";

        div.innerHTML = `
            <span><strong>${equipe.nome}</strong> - Plantão: ${equipe.plantao} - ${status}</span>
            <button onclick="alternarDisponibilidade(${index})">
                ${equipe.disponivel ? "Marcar como Indisponível" : "Marcar como Disponível"}
            </button>
        `;

        lista.appendChild(div);

        if (equipe.disponivel) {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = equipe.nome;
            select.appendChild(option);
        }
    });
}

function adicionarEquipe() {
    const nome = document.getElementById("nomeEquipe").value.trim();
    const dia = document.getElementById("diaPlantao").value.trim();

    if (nome && dia) {
        equipes.push({ nome, plantao: dia, disponivel: true });
        renderizarEquipes();
        document.getElementById("nomeEquipe").value = "";
        document.getElementById("diaPlantao").value = "";
    } else {
        alert("Preencha todos os campos.");
    }
}

function alternarDisponibilidade(index) {
    equipes[index].disponivel = !equipes[index].disponivel;
    renderizarEquipes();
}

function enviarEquipe() {
    const index = document.getElementById("selectEquipe").value;
    const mensagem = document.getElementById("mensagemEnvio");
    const historico = document.getElementById("historicoOcorrencias");

    if (index !== "") {
        const equipe = equipes[index];
        equipe.disponivel = false;

        const item = document.createElement("li");
        item.textContent = `${equipe.nome} enviada para ocorrência em ${new Date().toLocaleString()}`;
        historico.prepend(item);

        mensagem.textContent = `✅ ${equipe.nome} foi enviada para ocorrência.`;
        mensagem.style.color = "green";
        renderizarEquipes();
    } else {
        mensagem.textContent = "Selecione uma equipe.";
        mensagem.style.color = "red";
    }
}


function registrarOcorrencia() {
    const tipo = document.getElementById("tipoOcorrencia").value.trim();
    const regiao = document.getElementById("regiaoOcorrencia").value.trim();
    const tempo = parseInt(document.getElementById("tempoResposta").value);

    if (!tipo || !regiao || isNaN(tempo)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    ocorrencias.push({ tipo, regiao, tempo });


    document.getElementById("tipoOcorrencia").value = "";
    document.getElementById("regiaoOcorrencia").value = "";
    document.getElementById("tempoResposta").value = "";

    atualizarRelatorio();
}

function atualizarRelatorio() {
    const regioes = {};
    const tipos = {};
    let somaTempo = 0;

    ocorrencias.forEach(o => {
        if (o.tipo.toLowerCase() === "incêndio") {
            regioes[o.regiao] = (regioes[o.regiao] || 0) + 1;
        }

        tipos[o.tipo] = (tipos[o.tipo] || 0) + 1;
        somaTempo += o.tempo;
    });


    const ulRegiao = document.getElementById("incendiosRegiao");
    ulRegiao.innerHTML = "";
    for (const r in regioes) {
        const li = document.createElement("li");
        li.textContent = `${r}: ${regioes[r]} incêndio(s)`;
        ulRegiao.appendChild(li);
    }


    const ulTipo = document.getElementById("ocorrenciasTipo");
    ulTipo.innerHTML = "";
    for (const t in tipos) {
        const li = document.createElement("li");
        li.textContent = `${t}: ${tipos[t]} ocorrência(s)`;
        ulTipo.appendChild(li);
    }


    const media = ocorrencias.length ? (somaTempo / ocorrencias.length).toFixed(2) : 0;
    document.getElementById("mediaTempo").textContent = media;
}

window.onload = renderizarEquipes;
