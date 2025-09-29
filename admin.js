const PASSWORD = "1234"; // ⚠️ change ton mot de passe ici

const overlay = document.getElementById("admin-overlay");
const openBtn = document.getElementById("open-admin");
const closeBtn = document.getElementById("close-admin");
const loginBtn = document.getElementById("admin-login");
const logoutBtn = document.getElementById("admin-logout");
const passwordInput = document.getElementById("admin-password");
const msg = document.getElementById("admin-msg");
const controls = document.getElementById("admin-controls");
const toggleEditBtn = document.getElementById("toggle-edit");
const saveLocalBtn = document.getElementById("save-local");
const exportBtn = document.getElementById("export-json");
const importFile = document.getElementById("import-file");
const importBtn = document.getElementById("import-json");

// --- Nouveau bouton client ---
const clientBtn = document.getElementById("open-client");

let isAdmin = false;
let isEditing = false;

// Ouvrir / fermer panel admin
openBtn.onclick = () => overlay.classList.remove("admin-hidden");
closeBtn.onclick = () => overlay.classList.add("admin-hidden");

// Connexion admin
loginBtn.onclick = () => {
  if (passwordInput.value === PASSWORD) {
    isAdmin = true;
    msg.textContent = "✅ Connecté en admin";
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    controls.classList.remove("hidden");
  } else {
    msg.textContent = "❌ Mot de passe incorrect";
  }
};

// Déconnexion admin
logoutBtn.onclick = () => {
  isAdmin = false;
  isEditing = false;
  msg.textContent = "Déconnecté";
  loginBtn.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  controls.classList.add("hidden");
  document.querySelectorAll("[data-editable]").forEach(el => el.contentEditable = "false");
};

// Mode édition
toggleEditBtn.onclick = () => {
  if (!isAdmin) return;
  isEditing = !isEditing;
  document.querySelectorAll("[data-editable]").forEach(el => {
    el.contentEditable = isEditing ? "true" : "false";
    if (isEditing) el.style.outline = "1px dashed #00eaff";
    else el.style.outline = "none";
  });
};

// Sauvegarde locale
saveLocalBtn.onclick = () => {
  const data = {};
  document.querySelectorAll("[data-editable]").forEach(el => {
    data[el.dataset.key] = el.innerHTML;
  });
  localStorage.setItem("siteContent", JSON.stringify(data));
  msg.textContent = "💾 Sauvegardé localement";
};

// Charger contenu au démarrage
window.addEventListener("load", () => {
  const saved = localStorage.getItem("siteContent");
  if (saved) {
    const data = JSON.parse(saved);
    for (let key in data) {
      const el = document.querySelector(`[data-key="${key}"]`);
      if (el) el.innerHTML = data[key];
    }
  }
});

// Export JSON
exportBtn.onclick = () => {
  const data = {};
  document.querySelectorAll("[data-editable]").forEach(el => {
    data[el.dataset.key] = el.innerHTML;
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "siteContent.json";
  a.click();
};

// Import JSON
importBtn.onclick = () => {
  if (!importFile.files.length) return;
  const file = importFile.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    for (let key in data) {
      const el = document.querySelector(`[data-key="${key}"]`);
      if (el) el.innerHTML = data[key];
    }
    localStorage.setItem("siteContent", JSON.stringify(data));
  };
  reader.readAsText(file);
};

// --- Mode Client (sans mot de passe) ---
clientBtn.onclick = () => {
  isAdmin = false;
  isEditing = false;
  overlay.classList.add("admin-hidden");
  document.querySelectorAll("[data-editable]").forEach(el => {
    el.contentEditable = "false";
    el.style.outline = "none";
  });
  msg.textContent = "Mode client activé";
};
