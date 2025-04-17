programa
 {
   funcao inicio()
   {
     cadeia resposta
     real salario
     inteiro horas
     real salariobruto
     real descontoIR
     real descontoINSS
     real descontoSINDICATO
     real salarioLIQUIDO
 
     escreva("Você vai receber o salário este mês? (sim/nao): ")
     leia(resposta)
 
     se (resposta == "sim" ou resposta == "Sim")
     {
       escreva("Quanto voce ganha por hora trabalhada? R$")
       leia(salario)
       escreva("voce trabalha quantas horas? ")
       leia(horas)

       escreva("salario bruto é: R$", horas * salario)
       escreva("\ndesconto inss: R$", horas * salario * 0.08)
       escreva("\ndesconto IR: R$", horas * salario * 0.11)
       escreva("\ndesconto SINDICATO: R$", horas * salario * 0.05)
       escreva("\nseu salario liquido é de: R$", horas * salario - 0.11 * 0.08 * 0.05 )



     }
     senao se (resposta == "nao" ou resposta == "Nao")
     {
       escreva("Você não receberá o salário este mês, voce vai passar fome")
     }
     senao
     {
       escreva("Resposta inválida. Por favor, responda 'sim' ou 'nao'.")
     }
   }
 }