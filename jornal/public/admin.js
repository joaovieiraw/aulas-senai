import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpBNlap8GOFaMcgTE-OVtlQvv8moU4rMg",
  authDomain: "jornal-nova-era.firebaseapp.com",
  projectId: "jornal-nova-era",
  storageBucket: "jornal-nova-era.firebasestorage.app",
  messagingSenderId: "702429082609",
  appId: "1:702429082609:web:023638436ce080d91a0a50",
  measurementId: "G-F9JBP1WHT6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Bloqueia admin se não estiver logado
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// ✅ Função global pro onclick funcionar
window.publicar = async function () {
  const titulo = document.getElementById("titulo")?.value.trim();
  const conteudo = document.getElementById("conteudo")?.value.trim();
  const categoria = document.getElementById("categoria")?.value;

  if (!titulo || !conteudo || !categoria) {
    alert("Preencha título, conteúdo e categoria!");
    return;
  }

  try {
    await addDoc(collection(db, categoria), {
      titulo,
      conteudo,
      data: new Date()
    });

    alert("Publicado com sucesso!");
    document.getElementById("titulo").value = "";
    document.getElementById("conteudo").value = "";
  } catch (e) {
    alert("Erro ao publicar: " + e.message);
    console.log(e);
  }
};

window.adicionarMembro = async function () {
  const nome = document.getElementById("nomeMembro")?.value.trim();
  const cargo = document.getElementById("cargoMembro")?.value.trim();
  const foto = document.getElementById("fotoMembro")?.value.trim();

  if (!nome || !cargo) {
    alert("Preencha nome e cargo!");
    return;
  }

  try {
    await addDoc(collection(db, "membros"), {
      nome,
      cargo,
      foto: foto || "",
      data: new Date()
    });

    alert("Membro adicionado!");
    document.getElementById("nomeMembro").value = "";
    document.getElementById("cargoMembro").value = "";
    document.getElementById("fotoMembro").value = "";
  } catch (e) {
    alert("Erro ao adicionar membro: " + e.message);
    console.log(e);
  }
};
