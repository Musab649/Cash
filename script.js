let users = JSON.parse(localStorage.getItem("users")) || [
  { id: "70062", name: "Musab Ali", role: "admin", site: "مسالخ مدن منطقة الظفرة" },
];
let sites = JSON.parse(localStorage.getItem("sites")) || [];
let animals = JSON.parse(localStorage.getItem("animals")) || [];
let cuttings = JSON.parse(localStorage.getItem("cuttings")) || [];
let prices = JSON.parse(localStorage.getItem("prices")) || {};
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let currentUser = null;
let invoiceCounter = parseInt(localStorage.getItem("invoiceCounter")) || 1;

window.onload = () => {
  showSection("splash");
  setTimeout(() => showSection("login"), 2000);
  updateClock();
  setInterval(updateClock, 1000);
  populateInitialData();
  loadLogo();
};

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleString("ar-EG");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function populateInitialData() {
  fillSelect("newUserSite", sites);
  fillSelect("priceAnimal", animals);
  fillSelect("priceCutting", cuttings);
  fillSelect("animalType", animals);
  fillSelect("cuttingType", cuttings);
  fillSelect("animalNumber", Array.from({length: 50}, (_, i) => i + 1));
  fillSelect("stickerNumber", Array.from({length: 50}, (_, i) => i + 1));
  fillSelect("quantity", Array.from({length: 50}, (_, i) => i + 1));
  refreshUsersTable();
  refreshLists();
  updateInvoiceNumber();
}

function fillSelect(id, items) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  items.forEach(it => {
    let opt = document.createElement("option");
    opt.textContent = it;
    opt.value = it;
    sel.appendChild(opt);
  });
}

function refreshLists() {
  document.getElementById("sitesList").innerHTML = sites.map(s => `<li>${s}</li>`).join("");
  document.getElementById("animalsList").innerHTML = animals.map(a => `<li>${a}</li>`).join("");
  document.getElementById("cuttingsList").innerHTML = cuttings.map(c => `<li>${c}</li>`).join("");
}

function refreshUsersTable() {
  const t = document.getElementById("usersTable");
  t.innerHTML = `<tr><th>رقم</th><th>اسم</th><th>دور</th><th>موقع</th></tr>` +
    users.map(u => `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td>${u.site}</td></tr>`).join("");
}

function login() {
  const id = document.getElementById("employeeId").value.trim();
  const u = users.find(x => x.id === id);
  if (!u) return alert("غير موجود");
  currentUser = u;
  document.getElementById("username").textContent = u.name;
  document.getElementById("dataEntrySiteTitle").textContent = u.role === "admin" ? "كل المواقع" : `الموقع: ${u.site}`;
  showSection("dashboard");
  updateInvoiceNumber();
}

function addUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const role = document.getElementById("newUserRole").value;
  const site = document.getElementById("newUserSite").value;
  users.push({ id, name, role, site });
  saveAll();
  refreshUsersTable();
}

function addSite() {
  const s = document.getElementById("newSite").value.trim();
  if (s && !sites.includes(s)) sites.push(s);
  saveAll();
  populateInitialData();
}

function addAnimal() {
  const a = document.getElementById("newAnimal").value.trim();
  if (a && !animals.includes(a)) animals.push(a);
  saveAll();
  populateInitialData();
}

function addCutting() {
  const c = document.getElementById("newCutting").value.trim();
  if (c && !cuttings.includes(c)) cuttings.push(c);
  saveAll();
  populateInitialData();
}

function setPrice() {
  const a = document.getElementById("priceAnimal").value;
  const c = document.getElementById("priceCutting").value;
  const p = parseFloat(document.getElementById("priceValue").value);
  if (a && c) prices[`${a}_${c}`] = p;
  saveAll();
}

function updatePrice() {
  const a = document.getElementById("animalType").value;
  const c = document.getElementById("cuttingType").value;
  const q = parseInt(document.getElementById("quantity").value) || 1;
  const unit = prices[`${a}_${c}`] || 0;
  document.getElementById("unitPrice").value = unit;
  document.getElementById("totalPrice").value = unit * q;
}

function saveData() {
  const data = {
    site: currentUser.site,
    name: document.getElementById("clientName").value,
    phone: document.getElementById("phone").value,
    invoice: document.getElementById("invoiceNumber").value,
    animal: document.getElementById("animalType").value,
    cutting: document.getElementById("cuttingType").value,
    qty: document.getElementById("quantity").value,
    unit: document.getElementById("unitPrice").value,
    total: document.getElementById("totalPrice").value,
    payment: document.querySelector('input[name="paymentType"]:checked').value,
    date: new Date().toLocaleDateString()
  };
  invoices.push(data);
  invoiceCounter++;
  saveAll();
  updateInvoiceNumber();
}

function updateInvoiceNumber() {
  document.getElementById("invoiceNumber").value = String(invoiceCounter).padStart(5, "0");
}

function showInvoice() {
  const id = s => document.getElementById(s).value;
  document.getElementById("invNo").textContent = id("invoiceNumber");
  document.getElementById("invClient").textContent = id("clientName");
  document.getElementById("invPhone").textContent = id("phone");
  document.getElementById("invAnimalType").textContent = id("animalType");
  document.getElementById("invCuttingType").textContent = id("cuttingType");
  document.getElementById("invQty").textContent = id("quantity");
  document.getElementById("invUnitPrice").textContent = id("unitPrice");
  document.getElementById("invTotal").textContent = id("totalPrice");
  document.getElementById("invPaymentType").textContent = document.querySelector('input[name="paymentType"]:checked').value;
  document.getElementById("invDate").textContent = new Date().toLocaleDateString();
  showSection("invoicePreview");
}

function logout() {
  currentUser = null;
  showSection("login");
}

function saveAll() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("sites", JSON.stringify(sites));
  localStorage.setItem("animals", JSON.stringify(animals));
  localStorage.setItem("cuttings", JSON.stringify(cuttings));
  localStorage.setItem("prices", JSON.stringify(prices));
  localStorage.setItem("invoices", JSON.stringify(invoices));
  localStorage.setItem("invoiceCounter", invoiceCounter);
}

function closeProgram() {
  alert("شكرًا لاستخدامك النظام");
  window.close();
}

function changeColor() {
  document.body.style.background = document.getElementById("colorPicker").value;
}

function uploadLogo() {
  const file = document.getElementById("logoUploader").files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    localStorage.setItem("logo", e.target.result);
    loadLogo();
  };
  reader.readAsDataURL(file);
}

function loadLogo() {
  const logo = localStorage.getItem("logo");
  if (logo) {
    document.getElementById("logoPreview").src = logo;
  }
}
