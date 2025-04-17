programa {
  funcao inicio() {
    real nota1
    real nota2
    real nota3
    real media
    cadeia nome
    
    escreva("Calcular nota aluno 2025 atualizado 100% sem vírus real")
    escreva("\nqual teu nome?")
    leia(nome)
    
    escreva("Fale sua nota 1: ")
    leia(nota1)
    
    escreva("Fale sua nota 2: ")
    leia(nota2)
    
    escreva("Fale a última nota: ")
    leia(nota3)
    
    media = (nota1 + nota2 + nota3) / 3

    se (media <= 4) {
      escreva("Vish ",nome+", reprovou, sua nota foi: ", (nota1 + nota2 + nota3) / 3)
    } senao se (media > 5 e media < 7) {
      escreva("Eita,",nome+" ficou em exame, sua nota foi: ", (nota1 + nota2 + nota3) / 3)
    } senao {
      escreva("Você passou,",nome+" parabens, sua nota foi: ", (nota1 + nota2 + nota3) / 3)
    }
  }
}