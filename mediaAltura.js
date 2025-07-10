
const readline = require('readline');
const prompt = require('prompt-sync')()

const N = prompt("Digite o numero de pessoa")


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let n;
let alturas = [];


function pedirNumeroPessoas() {
  rl.question('Digite o numero de pessoas: ', (inputN) => {
    n = parseInt(inputN);


    if (isNaN(n) || n <= 0) {
      console.log('Por favor, digite um número válido de pessoas (maior que zero).');
      pedirNumeroPessoas();
    } else {
      pedirAlturas(0);
    }
  });
}


function pedirAlturas(indice) {
  if (indice < n) {
    rl.question(`Digite a altura da pessoa ${indice + 1}: `, (inputAltura) => {
      const altura = parseFloat(inputAltura);


      if (isNaN(altura) || altura <= 0) {
        console.log('Por favor, digite uma altura válida (um número maior que zero).');
        pedirAlturas(indice);
      } else {
        alturas.push(altura);
        pedirAlturas(indice + 1);
      }
    });
  } else {
    calcularEExibirMedia();
  }
}


function calcularEExibirMedia() {
  let soma = 0;
  for (let i = 0; i < n; i++) {
    soma += alturas[i];
  }

  const media = soma / n;
  console.log(`\nA media das alturas é: ${media.toFixed(2)}`);
  rl.close();
}


pedirNumeroPessoas();