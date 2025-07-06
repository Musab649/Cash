let currentUser = null;

let users = [
  { id: "70062", name: "Musab Ali", role: "admin", site: "مسلخ مدينة غياثي" },
];

let sites = ["مسلخ غياثي", "مسلخ مدينة"];
let animals = ["خروف", "ماعز", "بقر", "جمل"];
let cuttings = ["عزيمة", "ثلاجة"];

let prices = {
  "خروف": { "عزيمة": 100, "ثلاجة": 90 },
  "ماعز": { "عزيمة": 110, "ثلاجة": 95 },
  "بقر": { "عزيمة": 120, "ثلاجة": 100 },
  "جمل": { "عزيمة": 200, "ثلاجة": 180 }
};

let invoices = [];
let invoiceCounter = 1;

window.onload = () => {
  loadTheme();
  loadLogo();
  showSection("splash");
  setTimeout(() => showSection("login"), 2000);
  updateClock();
  setInterval(updateClock, 1000);
  populateSelects();
  updateInvoiceNumber();
};

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleDateString("ar-EG") + " " + now.toLocaleTimeString("ar-EG", { hour12: false });
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function login() {
  const empId = document.getElementById("employeeId").value.trim();
  if (!empId) {
    alert("الرجاء إدخال الرقم الوظيفي");
    return;
  }
  const user = users.find(u => u.id === empId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }
  currentUser = user;
  document.getElementById("username").textContent = currentUser.name;
  showSection("dashboard");
  clearDataEntryForm();
  updateInvoiceNumber();
}

function logout() {
  currentUser = null;
  document.getElementById("employeeId").value = "";
  showSection("login");
}

function saveColor() {
  const color = document.getElementById("themeColor").value;
  localStorage.setItem("themeColor", color);
  document.documentElement.style.setProperty("--theme-color", color);
  alert("تم حفظ اللون");
}

function loadTheme() {
  const color = localStorage.getItem("themeColor");
  if (color) {
    document.documentElement.style.setProperty("--theme-color", color);
    document.getElementById("themeColor").value = color;
  }
}

function saveLogo() {
  const fileInput = document.getElementById("logoUpload");
  if (fileInput.files.length === 0) {
    alert("اختر صورة الشعار أولاً");
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem("logo", e.target.result);
    setLogos(e.target.result);
    alert("تم حفظ الشعار");
  };
  reader.readAsDataURL(file);
}

function loadLogo() {
  const logoData = localStorage.getItem("logo");
  if (logoData) {
    setLogos(logoData);
  }
}

function setLogos(src) {
  document.getElementById("splashLogo").src = src;
  document.getElementById("dataLogo").src = src;
  document.getElementById("reportLogo").src = src;
}

function populateSelects() {
  fillSelect("animalType", animals);
  fillSelect("cuttingType", cuttings);
  fillSelect("animalNumber", Array.from({length:50}, (_,i) => i+1));
  fillSelect("stickerNumber", Array.from({length:100}, (_,i) => i+1));
  fillSelect("quantity", Array.from({length:50}, (_,i) => i+1));
}

function fillSelect(id, arr) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  arr.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

function updateInvoiceNumber() {
  document.getElementById("invoiceNumber").value = invoiceCounter.toString().padStart(5, "0");
