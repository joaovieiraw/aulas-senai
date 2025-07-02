function login() {
    const usuario = document.getElementById('usuario').value.trim();
    const perfil = document.getElementById('perfil').value;
  
    if (!usuario) {
      alert('Por favor, digite seu nome.');
      return;
    }
    if (!perfil) {
      alert('Por favor, selecione um perfil.');
      return;
    }
  

    localStorage.setItem('usuario', usuario);
    localStorage.setItem('perfil', perfil);
  

    switch(perfil) {
      case 'cidadao':
        window.location.href = 'index.html';
        break;
      case 'bombeiros':
        window.location.href = 'resultados.html';
        break;
      case 'admin':
        window.location.href = 'admin.html';
        break;
      case 'central':
        window.location.href = 'central.html';
        break;
      default:
        alert('Perfil inválido.');
    }
  }
  