import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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

const emailEl = document.getElementById("email");
const senhaEl = document.getElementById("senha");
const statusBox = document.getElementById("statusBox");

const btnCriar = document.getElementById("btnCriar");
const btnEntrar = document.getElementById("btnEntrar");
const btnSair = document.getElementById("btnSair");

function showStatus(msg){
  statusBox.style.display = "";
  statusBox.innerHTML = msg;
}

function clearStatus(){
  statusBox.style.display = "none";
  statusBox.innerHTML = "";
}

btnCriar.addEventListener("click", async () => {
  clearStatus();
  const email = emailEl.value.trim();
  const senha = senhaEl.value;

  if(!email || !senha) return showStatus("Preencha <strong>e-mail</strong> e <strong>senha</strong>.");
  if(senha.length < 6) return showStatus("A senha precisa ter pelo menos <strong>6 caracteres</strong>.");

  try{
    await createUserWithEmailAndPassword(auth, email, senha);
    showStatus("✅ Conta criada e você já está logado! Pode voltar e curtir/comentar.");
  }catch(e){
    showStatus("❌ Erro ao criar conta: " + e.message);
  }
});

btnEntrar.addEventListener("click", async () => {
  clearStatus();
  const email = emailEl.value.trim();
  const senha = senhaEl.value;

  if(!email || !senha) return showStatus("Preencha <strong>e-mail</strong> e <strong>senha</strong>.");

  try{
    await signInWithEmailAndPassword(auth, email, senha);
    showStatus("✅ Logado! Volte para as notícias e comente à vontade.");
  }catch(e){
    showStatus("❌ Erro no login: " + e.message);
  }
});

btnSair.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if(user){
    btnSair.style.display = "";
    btnCriar.style.display = "none";
    btnEntrar.style.display = "none";
    showStatus(`✅ Você está logado como <strong>${user.email}</strong>.<br>Volte ao jornal para curtir/comentar.`);
  }else{
    btnSair.style.display = "none";
    btnCriar.style.display = "";
    btnEntrar.style.display = "";
  }
});
