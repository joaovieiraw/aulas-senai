programa {
  funcao inicio() {
    inteiro celsius, kelvin
    cadeia temperatura
    escreva("qual temperatura? ")
    leia(celsius)
    escreva("sua temperatura em kelvin é:", celsius + 273.15)
    escreva("\nsua temperatura em fahrenheit é:", celsius * 1.8 + 32)
    se (celsius < 36.5)
    escreva("\nvoce esta com temperatura corporal normal")
    senao
    escreva("voce esta com febre")
  }
}