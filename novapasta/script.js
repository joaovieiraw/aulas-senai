const divbotaoiniciar = document.getElementById("iniciarjogo")
const divcaixaquiz = document.getElementById("caixaQuiz")
let indiceperguntas = 0

//array
const perguntas = [
    "Qual é o maior deserto do mundo?",
    "Qual é a capital do Brasil?",
    "Qual é a capital da Austrália?",
    "Qual é o país com maior população no mundo?",
    " Qual a linha imaginária que atravessa o Brasil?",
    "Qual o oceano que banha o Brasil?",
]

function iniciarjogo(){
    fecharbotaoinicio()
    abrirtelajogo()
}

function fecharbotaoinicio(){
    divbotaoiniciar.innerHTML = ""
}

function abrirtelajogo(indice) {
    divcaixaquiz.classList.add("active")


    const botaopergunta = document.createElement("button")
    botaopergunta.textContent = perguntas[indiceperguntas]
    botaopergunta.classList.add("answer-btn")
    opcoesrespostas.appendChild(botaopergunta)
}

function proximapergunta(){
    indiceperguntas++
    if(indiceperguntas < perguntas.length) {
        abrirtelajogo()
    }

}