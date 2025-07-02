document.getElementById('incendioForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const localizacao = encodeURIComponent(document.getElementById('localizacao').value);
    const incendio = encodeURIComponent(document.getElementById('incendio').value);
    const data = encodeURIComponent(document.getElementById('data').value);

    const mensagem = `Relato de Incêndio:%0ALocalização: ${localizacao}%0AIncêndio: ${incendio}%0AData: ${data}`;


    const telefone = '5548988777057';

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${mensagem}`;


    window.open(urlWhatsApp, '_blank');
  });