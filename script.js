// script.js

// بيانات المستخدمين (تقدر تضيف أو تعدل هنا أو في الإعدادات)
let users = [
  { id: "100", name: "مسؤول", role: "admin", site: "مسلخ غياثي" },
  { id: "200", name: "مستخدم1", role: "user", site: "مسلخ مدينة" }
];

// بيانات المواقع، الذبائح، التقطيع، والأسعار
let sites = ["مسلخ غياثي", "مسلخ مدينة"];
let animals = ["خروف", "ماعز", "بقر", "جمل"];
let cuttings = ["عزيمة", "ثلاجة"];
let prices = {}; // prices[animal][cutting] = السعر

let invoices = [];
let currentUser = null;
let invoiceCounter = 1;

// تشغيل البرنامج
window.onload = () => {
  showSection("splash");
  setTimeout(() => showSection("login"), 2000);

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

// إظهار قسم معين وإخفاء الباقي
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // إذا المسؤول داخل، نعرض أزرار المسؤول
  if (currentUser && currentUser.role === "admin") {
    document.body.classList.add("admin-active");
  } else {
    document.body.classList.remove("admin-active");
  }
}

// تهيئة البيانات الأولية
function populateInitialData() {
  fillSelect("priceAnimal", animals);
  fillSelect("priceCutting", cuttings);
  fillSelect("animalType", animals);
  fillSelect("cuttingType", cuttings);
  fillSelect("animalNumber", Array.from({ length: 50 }, (_, i) => i + 1));
  fillSelect("stickerNumber", Array.from({ length: 100 }, (_, i) => i + 1));
  fillSelect("quantity", Array.from({ length: 50 }, (_, i) => i + 1));

  refreshUsersTable();
  refreshSitesList();
  refreshAnimalsList();
  refreshCuttingsList();
  updateInvoiceNumber();
  setupNewUserSiteSelect();
}

// تعبئة قوائم الاختيار (Select)
function fillSelect(id, items) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  items.forEach((item) => {
    let option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

// تحديث رقم الفاتورة تلقائياً
function updateInvoiceNumber() {
  document.getElementById("invoiceNumber").value = invoiceCounter.toString().padStart(5, "0");
}

// تسجيل الدخول
function login() {
  const empId = document.getElementById("employeeId").value.trim();
  if (!empId) {
    alert("الرجاء إدخال الرقم الوظيفي");
    return;
  }
  const user = users.find((u) => u.id === empId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }
  currentUser = user;
  document.getElementById("username").textContent = currentUser.name;
  setupDataEntrySite();
  clearDataEntryForm();
  showSection("dashboard");
}

// إعداد عنوان الموقع في شاشة إدخال البيانات بناءً على المستخدم
function setupDataEntrySite() {
  const title = document.getElementById("dataEntrySiteTitle");
  if (currentUser.role === "admin") {
    title.textContent = "كل المواقع متاحة للمسؤول";
  } else {
    title.textContent = `الموقع: ${currentUser.site}`;
  }
}

// تسجيل الخروج
function logout() {
  currentUser = null;
  clearLoginForm();
  showSection("login");
}

// إلغاء / غلق البرنامج (يمكن تعديلها حسب احتياجك)
function closeProgram() {
  if (confirm("هل تريد فعلاً إغلاق البرنامج؟")) {
    window.close();
  }
}

// تفريغ نموذج تسجيل الدخول
function clearLoginForm() {
  document.getElementById("employeeId").value = "";
}

// تفريغ نموذج إدخال البيانات
function clearDataEntryForm() {
  document.getElementById("phone").value = "";
  document.getElementById("clientName").value = "";
  document.getElementById("animalType").selectedIndex = 0;
  document.getElementById("cuttingType").selectedIndex = 0;
  document.getElementById("animalNumber").selectedIndex = 0;
  document.getElementById("stickerNumber").selectedIndex = 0;
  document.getElementById("quantity").selectedIndex = 0;
  document.getElementById("unitPrice").value = "";
  document.getElementById("totalPrice").value = "";
  updateInvoiceNumber();
}

// تحديث سعر الوحدة والإجمالي بناء على الاختيارات
function updatePrice() {
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const quantity = Number(document.getElementById("quantity").value);
  let unitPrice = 0;

  if (prices[animal] && prices[animal][cutting]) {
    unitPrice = prices[animal][cutting];
  }

  document.getElementById("unitPrice").value = unitPrice;
  document.getElementById("totalPrice").value = (unitPrice * quantity).toFixed(2);
}

// إضافة مستخدم جديد
function addUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const role = document.getElementById("newUserRole").value;
  const site = document.getElementById("newUserSite").value;

  if (!id || !name || !role || !site) {
    alert("يرجى ملء كل الحقول");
    return;
  }

  if (users.find((u) => u.id === id)) {
    alert("الرقم الوظيفي موجود مسبقاً");
    return;
  }

  users.push({ id, name, role, site });
  refreshUsersTable();
  clearNewUserForm();
}

// تفريغ نموذج إضافة مستخدم جديد
function clearNewUserForm() {
  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
  document.getElementById("newUserRole").selectedIndex = 0;
  document.getElementById("newUserSite").selectedIndex = 0;
}

// تحديث جدول المستخدمين
function refreshUsersTable() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.role === "admin" ? "مسؤول" : "مستخدم"}</td>
      <td>${user.site}</td>
      <td>
        <button onclick="deleteUser(${index})" class="action-btn delete">حذف</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// حذف مستخدم
function deleteUser(index) {
  if (confirm("هل أنت متأكد من حذف المستخدم؟")) {
    users.splice(index, 1);
    refreshUsersTable();
  }
}

// إضافة موقع جديد
function addSite() {
  const newSite = document.getElementById("newSite").value.trim();
  if (!newSite) {
    alert("أدخل اسم الموقع");
    return;
  }
  if (sites.includes(newSite)) {
    alert("الموقع موجود مسبقاً");
    return;
  }
  sites.push(newSite);
  refreshSitesList();
  setupNewUserSiteSelect();
  document.getElementById("newSite").value = "";
}

// تحديث قائمة المواقع في الإعدادات
function refreshSitesList() {
  const ul = document.getElementById("sitesList");
  ul.innerHTML = "";
  sites.forEach((site, i) => {
    const li = document.createElement("li");
    li.textContent = site + " ";
    const delBtn = document.createElement("button");
    delBtn.textContent = "حذف";
    delBtn.onclick = () => {
      if (confirm("هل تريد حذف الموقع؟")) {
        sites.splice(i, 1);
        refreshSitesList();
        setupNewUserSiteSelect();
      }
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}

// تجهيز قائمة المواقع في اختيار إضافة المستخدم
function setupNewUserSiteSelect() {
  fillSelect("newUserSite", sites);
}

// إضافة نوع ذبيحة جديد
function addAnimal() {
  const newAnimal = document.getElementById("newAnimal").value.trim();
  if (!newAnimal) {
    alert("أدخل نوع ذبيحة");
    return;
  }
  if (animals.includes(newAnimal)) {
    alert("نوع الذبيحة موجود مسبقاً");
    return;
  }
  animals.push(newAnimal);
  refreshAnimalsList();
  populateInitialData();
  document.getElementById("newAnimal").value = "";
}

// تحديث قائمة أنواع الذبائح
function refreshAnimalsList() {
  const ul = document.getElementById("animalsList");
  ul.innerHTML = "";
  animals.forEach((animal, i) => {
    const li = document.createElement("li");
    li.textContent = animal + " ";
    const delBtn = document.createElement("button");
    delBtn.textContent = "حذف";
    delBtn.onclick = () => {
      if (confirm("هل تريد حذف نوع الذبيحة؟")) {
        animals.splice(i, 1);
        refreshAnimalsList();
        populateInitialData();
      }
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}

// إضافة نوع تقطيع جديد
function addCutting() {
  const newCutting = document.getElementById("newCutting").value.trim();
  if (!newCutting) {
    alert("أدخل نوع تقطيع");
    return;
  }
  if (cuttings.includes(newCutting)) {
    alert("نوع التقطيع موجود مسبقاً");
    return;
  }
  cuttings.push(newCutting);
  refreshCuttingsList();
  populateInitialData();
  document.getElementById("newCutting").value = "";
}

// تحديث قائمة التقطيعات
function refreshCuttingsList() {
  const ul = document.getElementById("cuttingsList");
  ul.innerHTML = "";
  cuttings.forEach((cutting, i) => {
    const li = document.createElement("li");
    li.textContent = cutting + " ";
    const delBtn = document.createElement("button");
    delBtn.textContent = "حذف";
    delBtn.onclick = () => {
      if (confirm("هل تريد حذف نوع التقطيع؟")) {
        cuttings.splice(i, 1);
        refreshCuttingsList();
        populateInitialData();
      }
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });
}

// تعيين سعر معين للذبيحة والتقطيع (خاص بالمسؤول)
function setPrice() {
  if (currentUser.role !== "admin") {
    alert("غير مسموح لك بتعيين الأسعار");
    return;
  }

  const animal = document.getElementById("priceAnimal").value;
  const cutting = document.getElementById("priceCutting").value;
  const priceVal = Number(document.getElementById("priceValue").value);

  if (!animal || !cutting || priceVal <= 0) {
    alert("يرجى إدخال السعر بشكل صحيح");
    return;
  }

  if (!prices[animal]) prices[animal] = {};
  prices[animal][cutting] = priceVal;

  alert(`تم تعيين سعر ${priceVal} لـ (${animal} - ${cutting})`);

  document.getElementById("priceValue").value = "";
  updatePrice();
}

// البحث عن اسم العميل بناء على رقم الهاتف
function lookupClient() {
  const phone = document.getElementById("phone").value.trim();
  if (!phone) {
    document.getElementById("clientName").value = "";
    return;
  }
  // نبحث في الفواتير القديمة
  let found = invoices.find(inv => inv.phone === phone);
  if (found) {
    document.getElementById("clientName").value = found.clientName;
  } else {
    document.getElementById("clientName").value = "";
  }
}

// حفظ بيانات الفاتورة
function saveData() {
  if (!currentUser) {
    alert("يجب تسجيل الدخول أولاً");
    showSection("login");
    return;
  }

  const invoiceNo = document.getElementById("invoiceNumber").value;
  const phone = document.getElementById("phone").value.trim();
  const clientName = document.getElementById("clientName").value.trim();
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const animalNum = document.getElementById("animalNumber").value;
  const stickerNum = document.getElementById("stickerNumber").value;
  const quantity = Number(document.getElementById("quantity").value);
  const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
  const unitPrice = Number(document.getElementById("unitPrice").value);
  const totalPrice = Number(document.getElementById("totalPrice").value);
  const date = new Date();

  if (!phone || !clientName || quantity <= 0 || unitPrice <= 0) {
    alert
