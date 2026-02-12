import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth(app);

window.signup = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  if (!email || !senha) return alert("Preencha email e senha!");
  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Conta criada! Agora você pode curtir e comentar.");
  } catch (e) {
    alert("Erro: " + e.message);
  }
};

window.loginUser = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  if (!email || !senha) return alert("Preencha email e senha!");
  try {
    await signInWithEmailAndPassword(auth, email, senha);
    alert("Você entrou! Volte nas notícias.");
  } catch (e) {
    alert("Erro: " + e.message);
  }
};

window.logoutUser = async () => {
  await signOut(auth);
  alert("Saiu da conta.");
};
