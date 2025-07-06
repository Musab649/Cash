let users = [
  { id: "70062", name: "Musab Ali", role: "admin", site: "مسلخ مدينة غياثي" },
  { id: "200", name: "مستخدم1", role: "user", site: "مسلخ مدينة غياثي" }
];

let sites = ["مسلخ غياثي", "مسلخ مدينة"];
let animals = ["خروف", "ماعز", "بقر", "جمل"];
let cuttings = ["عزيمة", "ثلاجة"];
let prices = {};
let invoices = [];
let currentUser = null;
let invoiceCounter = 1;

// بدء العمل
window.onload = () => {
  showSection("splash");
  setTimeout(() => {
    showSection("login");
  }, 3000);
  updateClock();
  setInterval(updateClock, 1000);
  populateInitialData();
};

// تحديث الساعة والتاريخ
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ar-EG", { hour12: false });
  const dateStr = now.toLocaleDateString("ar-EG");
  clock.textContent = `${dateStr} ${timeStr}`;
}

// إظهار الشاشة المطلوبة
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// تهيئة البيانات الأولية
function populateInitialData() {
  fillSelect("animalType", animals);
  fillSelect("cuttingType", cuttings);
  fillSelect("animalNumber", Array.from({ length: 50 }, (_, i) => i + 1));
  fillSelect("stickerNumber", Array.from({ length: 100 }, (_, i) => i + 1));
  fillSelect("quantity", Array.from({ length: 50 }, (_, i) => i + 1));
  refreshUsersTable
    refreshUsersTable();
  refreshSitesList();
  refreshAnimalsList();
  refreshCuttingsList();
  updateInvoiceNumber();
}

function fillSelect(id, items) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function updateInvoiceNumber() {
  document.getElementById("invoiceNumber").value = invoiceCounter.toString().padStart(5, "0");
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
  document.getElementById("username").textContent = user.name;
  setupDataEntrySite();
  showSection("dashboard");
  clearDataEntryForm();
}

function logout() {
  currentUser = null;
  showSection("login");
}

function setupDataEntrySite() {
  const title = document.getElementById("dataEntrySiteTitle");
  if (currentUser.role === "admin") {
    title.textContent = "كل المواقع متاحة للمسؤول";
  } else {
    title.textContent = `الموقع: ${currentUser.site}`;
  }
}

function refreshUsersTable() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  users.forEach((u, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.role}</td>
      <td>${u.site}</td>
      <td><button onclick="deleteUser(${index})">حذف</button></td>
    `;
    tbody.appendChild(tr);
  });
  fillSelect("newUserSite", sites);
}

function deleteUser(index) {
  if (confirm("هل أنت متأكد من الحذف؟")) {
    users.splice(index, 1);
    refreshUsersTable();
  }
}

function addUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const role = document.getElementById("newUserRole").value;
  const site = document.getElementById("newUserSite").value;

  if (!id || !name) {
    alert("يرجى إدخال جميع البيانات");
    return;
  }
  users.push({ id, name, role, site });
  refreshUsersTable();
}

function addSite() {
  const site = document.getElementById("newSite").value.trim();
  if (site && !sites.includes(site)) {
    sites.push(site);
    refreshSitesList();
    refreshUsersTable();
  }
}

function refreshSitesList() {
  const list = document.getElementById("sitesList");
  list.innerHTML = "";
  sites.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    list.appendChild(li);
  });
}

function addAnimal() {
  const animal = document.getElementById("newAnimal").value.trim();
  if (animal && !animals.includes(animal)) {
    animals.push(animal);
    refreshAnimalsList();
    populateInitialData();
  }
}

function refreshAnimalsList() {
  const list = document.getElementById("animalsList");
  list.innerHTML = "";
  animals.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    list.appendChild(li);
  });
}

function addCutting() {
  const cutting = document.getElementById("newCutting").value.trim();
  if (cutting && !cuttings.includes(cutting)) {
    cuttings.push(cutting);
    refreshCuttingsList();
    populateInitialData();
  }
}

function refreshCuttingsList() {
  const list = document.getElementById("cuttingsList");
  list.innerHTML = "";
  cuttings.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    list.appendChild(li);
  });
}

function changeColor() {
  const color = document.getElementById("colorPicker").value;
  document.documentElement.style.setProperty('--main-color', color);
  document.querySelectorAll("button").forEach(btn => btn.style.backgroundColor = color);
}

function setPrice() {
  const animal = document.getElementById("priceAnimal").value;
  const cutting = document.getElementById("priceCutting").value;
  const price = parseFloat(document.getElementById("priceValue").value);
  if (animal && cutting && price > 0) {
    prices[`${animal}_${cutting}`] = price;
    alert(`تم تعيين السعر: ${price}`);
  }
}

function updatePrice() {
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const qty = parseInt(document.getElementById("quantity").value || 1);
  const price = prices[`${animal}_${cutting}`] || 0;
  document.getElementById("unitPrice").value = price;
  document.getElementById("totalPrice").value = price * qty;
}

function lookupClient() {
  // يمكن إضافة منطق لاحقاً لحفظ العملاء
}

function saveData() {
  const phone = document.getElementById("phone").value.trim();
  const client = document.getElementById("clientName").value.trim();
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const qty = parseInt(document.getElementById("quantity").value);
  const unitPrice = parseFloat(document.getElementById("unitPrice").value);
  const totalPrice = parseFloat(document.getElementById("totalPrice").value);
  const paymentType = document.querySelector('input[name="paymentType"]:checked').value;

  const invoice = {
    site: currentUser.site || "إداري",
    client, phone,
    invoiceNo: invoiceCounter,
    animal, cutting,
    qty, unitPrice, totalPrice, paymentType,
    date: new Date().toLocaleString("ar-EG")
  };

  invoices.push(invoice);
  addToReport(invoice);
  invoiceCounter++;
  updateInvoiceNumber();
  alert("تم حفظ الفاتورة بنجاح");
  clearDataEntryForm();
}

function clearDataEntryForm() {
  document.getElementById("phone").value = "";
  document.getElementById("clientName").value = "";
  document.getElementById("quantity").value = "1";
  document.getElementById("unitPrice").value = "";
  document.getElementById("totalPrice").value = "";
}

function addToReport(invoice) {
  const tbody = document.querySelector("#reportTable tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${invoice.site}</td>
    <td>${invoice.client}</td>
    <td>${invoice.phone}</td>
    <td>${invoice.invoiceNo}</td>
    <td>${invoice.animal}</td>
    <td>${invoice.cutting}</td>
    <td>${invoice.qty}</td>
    <td>${invoice.paymentType}</td>
    <td>${invoice.unitPrice}</td>
    <td>${invoice.totalPrice}</td>
    <td>${invoice.date}</td>
  `;
  tbody.appendChild(tr);
}

function showInvoice() {
  document.getElementById("invNo").textContent = document.getElementById("invoiceNumber").value;
  document.getElementById("invClient").textContent = document.getElementById("clientName").value;
  document.getElementById("invPhone").textContent = document.getElementById("phone").value;
  document.getElementById("invAnimalType").textContent = document.getElementById("animalType").value;
  document.getElementById("invCuttingType").textContent = document.getElementById("cuttingType").value;
  document.getElementById("invQty").textContent = document.getElementById("quantity").value;
  document.getElementById("invUnitPrice").textContent = document.getElementById("unitPrice").value;
  document.getElementById("invTotal").textContent = document.getElementById("totalPrice").value;
  document.getElementById("invPaymentType").textContent = document.querySelector('input[name="paymentType"]:checked').value;
  document.getElementById("invDate").textContent = new Date().toLocaleString("ar-EG");

  showSection("invoicePreview");
}
  
