import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  limit,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyBpBNlap8GOFaMcgTE-OVtlQvv8moU4rMg",
  authDomain: "jornal-nova-era.firebaseapp.com",
  projectId: "jornal-nova-era",
  storageBucket: "jornal-nova-era.firebasestorage.app",
  messagingSenderId: "702429082609",
  appId: "1:702429082609:web:023638436ce080d91a0a50",
  measurementId: "G-F9JBP1WHT6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
onAuthStateChanged(auth, (u) => (currentUser = u));

/* ================= HELPERS ================= */
function fmtDate(d) {
  try {
    const date = d?.toDate ? d.toDate() : d instanceof Date ? d : null;
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

function snippet(text, max = 210) {
  if (!text) return "";
  const t = String(text).trim();
  return t.length > max ? t.slice(0, max).trim() + "..." : t;
}

function escapeHTML(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function requireLogin() {
  if (!currentUser) {
    alert("Você precisa estar logado para curtir/comentar. Vá em Conta e faça login.");
    window.location.href = "conta.html";
    return false;
  }
  return true;
}

/* ================= LOGIN (login.html onclick="login()") ================= */
window.login = async function () {
  const emailEl = document.getElementById("email");
  const senhaEl = document.getElementById("senha");

  if (!emailEl || !senhaEl) {
    alert("Campos de login não encontrados.");
    return;
  }

  const email = emailEl.value.trim();
  const senha = senhaEl.value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "admin.html";
  } catch (e) {
    alert("Erro no login: " + e.message);
  }
};

window.logout = async function () {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (e) {
    alert("Erro ao sair: " + e.message);
  }
};

/* ================= PORTAL NAV (abas) ================= */
function setupTabs() {
  const tabs = document.querySelectorAll(".tab[data-view]");
  if (!tabs.length) return; // ex: login/admin/conta

  const views = {
    inicio: document.getElementById("view-inicio"),
    noticias: document.getElementById("view-noticias"),
    enem: document.getElementById("view-enem"),
    comemoracoes: document.getElementById("view-comemoracoes"),
    membros: document.getElementById("view-membros"),
  };

  function showView(name) {
    Object.entries(views).forEach(([k, el]) => {
      if (!el) return;
      el.classList.toggle("is-visible", k === name);
    });

    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.view === name));
    history.replaceState(null, "", `#${name}`);
  }

  tabs.forEach((btn) => btn.addEventListener("click", () => showView(btn.dataset.view)));

  const hash = (location.hash || "#inicio").replace("#", "");
  showView(views[hash] ? hash : "inicio");
}

/* ================= LIKE / COMMENTS (Firestore paths) =================
   colecao do post: noticias | enem | comemoracoes
   post: /{colecao}/{postId}
   likes: /{colecao}/{postId}/likes/{uid}
   comentarios: /{colecao}/{postId}/comentarios/{comentId}
====================================================================== */

async function getLikeCount(colName, postId) {
  const snap = await getDocs(collection(db, colName, postId, "likes"));
  return snap.size;
}

async function getCommentCount(colName, postId) {
  const snap = await getDocs(collection(db, colName, postId, "comentarios"));
  return snap.size;
}

async function didUserLike(colName, postId, uid) {
  const likeRef = doc(db, colName, postId, "likes", uid);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
}

async function refreshCountsForCard(cardEl, colName, postId) {
  const likeCountEl = cardEl.querySelector('[data-role="like-count"]');
  const comCountEl = cardEl.querySelector('[data-role="comment-count"]');
  const likeBtn = cardEl.querySelector(".btn-like");

  const [lc, cc] = await Promise.all([
    getLikeCount(colName, postId),
    getCommentCount(colName, postId),
  ]);

  if (likeCountEl) likeCountEl.textContent = lc;
  if (comCountEl) comCountEl.textContent = cc;

  // atualizar estado do botão (se estiver logado)
  if (currentUser && likeBtn) {
    const liked = await didUserLike(colName, postId, currentUser.uid);
    likeBtn.classList.toggle("is-liked", liked);
  } else if (likeBtn) {
    likeBtn.classList.remove("is-liked");
  }
}

async function toggleLike(colName, postId) {
  if (!requireLogin()) return;

  const uid = currentUser.uid;
  const likeRef = doc(db, colName, postId, "likes", uid);
  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    await deleteDoc(likeRef);
  } else {
    await setDoc(likeRef, { createdAt: serverTimestamp() });
  }
}

async function loadCommentsInto(cardEl, colName, postId) {
  const listEl = cardEl.querySelector(".comments-list");
  if (!listEl) return;

  listEl.innerHTML = `<div class="meta">Carregando comentários...</div>`;

  const q = query(
    collection(db, colName, postId, "comentarios"),
    orderBy("createdAt", "desc"),
    limit(30)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = `<div class="meta">Sem comentários ainda. Seja o primeiro 🙂</div>`;
    return;
  }

  const html = [];
  snap.forEach((d) => {
    const c = d.data();
    const nome = escapeHTML(c.nome || "Usuário");
    const texto = escapeHTML(c.texto || "");
    html.push(`
      <div class="comment">
        <div class="comment-head">
          <strong>${nome}</strong>
          <span class="meta">${fmtDate(c.createdAt)}</span>
        </div>
        <div class="comment-body">${texto}</div>
      </div>
    `);
  });

  listEl.innerHTML = html.join("");
}

async function sendComment(colName, postId, text) {
  if (!requireLogin()) return;

  const nome = currentUser.displayName || currentUser.email || "Usuário";

  await addDoc(collection(db, colName, postId, "comentarios"), {
    uid: currentUser.uid,
    nome,
    texto: text,
    createdAt: serverTimestamp(),
  });
}

/* ================= LOAD POSTS (portal) ================= */
async function loadPosts(collectionName, opts) {
  const { headlineEl, gridEl, headlineTitle } = opts;
  if (!headlineEl && !gridEl) return;

  const q = query(collection(db, collectionName), orderBy("data", "desc"));
  const snap = await getDocs(q);

  const items = [];
  snap.forEach((docu) => items.push({ id: docu.id, ...docu.data() }));

  // manchete (só em notícias)
  if (headlineEl) {
    if (items.length === 0) {
      headlineEl.innerHTML = `
        <h2 class="feature-title">${headlineTitle || "Sem publicações ainda"}</h2>
        <p class="feature-subtitle">Quando publicarem, vai aparecer aqui.</p>
      `;
    } else {
      const first = items[0];
      headlineEl.innerHTML = `
        <h2 class="feature-title">${escapeHTML(first.titulo || "Sem título")}</h2>
        <p class="feature-subtitle">${escapeHTML(snippet(first.conteudo, 240))}</p>
      `;
    }
  }

  // grid cards
  if (gridEl) {
    const list = headlineEl ? items.slice(1) : items;

    gridEl.innerHTML =
      list
        .map((p) => {
          const postId = p.id;
          const title = escapeHTML(p.titulo || "Sem título");
          const date = fmtDate(p.data);
          const body = escapeHTML(snippet(p.conteudo, 220));

          return `
          <article class="card post" data-col="${collectionName}" data-id="${postId}">
            <h3>${title}</h3>
            <div class="meta">${date}</div>
            <p>${body}</p>

            <div class="post-actions">
              <button class="btn-like" type="button">
                ❤️ Curtir (<span data-role="like-count">0</span>)
              </button>

              <button class="btn-toggle-comments" type="button">
                💬 Comentários (<span data-role="comment-count">0</span>)
              </button>
            </div>

            <div class="comments" hidden>
              <div class="comments-list"></div>

              <div class="comment-form">
                <input class="comment-input" type="text" maxlength="300" placeholder="Escreva um comentário..." />
                <button class="btn-send-comment" type="button">Enviar</button>
              </div>

              <div class="meta comment-hint">
                Dica: você precisa estar logado para comentar/curtir.
              </div>
            </div>
          </article>
        `;
        })
        .join("") ||
      `
        <article class="card">
          <h3>Sem publicações</h3>
          <p>Quando publicarem, vai aparecer aqui.</p>
        </article>
      `;

    // depois de renderizar, atualizar contagens
    const cards = gridEl.querySelectorAll(".card.post");
    for (const card of cards) {
      const colName = card.dataset.col;
      const postId = card.dataset.id;
      refreshCountsForCard(card, colName, postId);
    }
  }
}

/* ================= LOAD MEMBERS (portal) ================= */
async function loadMembers() {
  const grid = document.getElementById("membros-grid");
  if (!grid) return;

  const snap = await getDocs(collection(db, "membros"));
  const members = [];
  snap.forEach((docu) => members.push({ id: docu.id, ...docu.data() }));

  grid.innerHTML =
    members
      .map((m) => {
        return `
        <article class="card">
          <h3>${escapeHTML(m.nome || "Sem nome")}</h3>
          <div class="member-role">${escapeHTML(m.cargo || "")}</div>
        </article>
      `;
      })
      .join("") ||
    `
      <article class="card">
        <h3>Nenhum membro cadastrado</h3>
        <p>Quando adicionarem no admin, vai aparecer aqui.</p>
      </article>
    `;
}

/* ================= ADMIN (publicar + membros) ================= */
function setupAdminButtons() {
  const btnPublicar = document.getElementById("btnPublicar");
  const btnMembro = document.getElementById("btnMembro");

  if (btnPublicar) {
    btnPublicar.addEventListener("click", async () => {
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
          data: new Date(),
        });

        alert("Publicado com sucesso!");
        document.getElementById("titulo").value = "";
        document.getElementById("conteudo").value = "";
      } catch (e) {
        alert("Erro ao publicar: " + e.message);
      }
    });
  }

  if (btnMembro) {
    btnMembro.addEventListener("click", async () => {
      const nome = document.getElementById("nomeMembro")?.value.trim();
      const cargo = document.getElementById("cargoMembro")?.value.trim();
      const foto = document.getElementById("fotoMembro")?.value.trim(); // opcional

      if (!nome || !cargo) {
        alert("Preencha nome e cargo do membro!");
        return;
      }

      try {
        await addDoc(collection(db, "membros"), { nome, cargo, foto: foto || "" });
        alert("Membro adicionado!");
        document.getElementById("nomeMembro").value = "";
        document.getElementById("cargoMembro").value = "";
        document.getElementById("fotoMembro").value = "";
      } catch (e) {
        alert("Erro ao adicionar membro: " + e.message);
      }
    });
  }
}

/* ================= CLICK HANDLERS (like/comments) ================= */
document.addEventListener("click", async (ev) => {
  const card = ev.target.closest(".card.post");
  if (!card) return;

  const colName = card.dataset.col;
  const postId = card.dataset.id;

  // curtir
  if (ev.target.closest(".btn-like")) {
    try {
      await toggleLike(colName, postId);
      await refreshCountsForCard(card, colName, postId);
    } catch (e) {
      alert("Erro ao curtir: " + e.message);
    }
    return;
  }

  // abrir/fechar comentários
  if (ev.target.closest(".btn-toggle-comments")) {
    const box = card.querySelector(".comments");
    if (!box) return;

    const willOpen = box.hidden === true;
    box.hidden = !willOpen;

    if (willOpen) {
      await loadCommentsInto(card, colName, postId);
      await refreshCountsForCard(card, colName, postId);
    }
    return;
  }

  // enviar comentário
  if (ev.target.closest(".btn-send-comment")) {
    const input = card.querySelector(".comment-input");
    const text = input?.value.trim();
    if (!text) {
      alert("Digite um comentário antes de enviar.");
      return;
    }

    try {
      await sendComment(colName, postId, text);
      input.value = "";
      await loadCommentsInto(card, colName, postId);
      await refreshCountsForCard(card, colName, postId);
    } catch (e) {
      alert("Erro ao comentar: " + e.message);
    }
    return;
  }
});

/* ================= INIT (roda em qualquer página) ================= */
async function init() {
  setupTabs();

  await loadPosts("noticias", {
    headlineEl: document.getElementById("noticias-manchete"),
    gridEl: document.getElementById("noticias-grid"),
    headlineTitle: "Notícias",
  });

  await loadPosts("enem", {
    gridEl: document.getElementById("enem-grid"),
  });

  await loadPosts("comemoracoes", {
    gridEl: document.getElementById("comemoracoes-grid"),
  });

  await loadMembers();

  setupAdminButtons();
}

init();
