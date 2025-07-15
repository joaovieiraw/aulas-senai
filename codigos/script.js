let alunos = [];

document.getElementById('cadastrar').addEventListener('click', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const notas = document.getElementById('notas').value.split(',').map(Number);
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    const situacao = media >= 7 ? 'Aprovado' : 'Reprovado';
    alunos.push({
        nome,
        quantidadeNotas: notas.length,
        notas,
        media,
        situacao
    });
    atualizarTabela();
});

function atualizarTabela() {
    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = '';
    alunos.forEach((aluno) => {
        const linha = document.createElement('tr');
        const situacaoCor = aluno.situacao === 'Aprovado' ? 'green' : 'red';
        linha.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.quantidadeNotas}</td>
            <td>${aluno.notas.join(', ')}</td>
            <td>${aluno.media.toFixed(2)}</td>
            <td style="color: ${situacaoCor};">${aluno.situacao}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}