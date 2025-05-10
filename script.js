// نظام الإدارة لـ MBL INFO 🏴‍☠️
const siteConfig = {
  admin: {
    password: "MBL123456" // كلمة السر المطلوبة
  },
  maxFileSize: 20 * 1024 * 1024 * 1024, // 20GB حد أقصى
  sessionTimeout: 30 // دقيقة لانتهاء الجلسة
};

let appState = {
  isAdmin: false,
  content: "",
  files: []
};

// عناصر DOM
const elements = {
  loginForm: document.getElementById('login-form'),
  adminPanel: document.getElementById('admin-panel'),
  fileInput: document.getElementById('file-upload'),
  contentEditor: document.getElementById('content-editor'),
  fileSizeWarning: document.getElementById('file-size-warning')
};

// تسجيل الدخول
elements.loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const password = e.target.password.value;
  
  if (password === siteConfig.admin.password) {
    appState.isAdmin = true;
    showAdminPanel();
    startSessionTimer();
  } else {
    alert("كلمة السر غير صحيحة!");
  }
});

// إدارة الملفات
elements.fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  let totalSize = 0;
  
  // حساب الحجم الكلي
  for (let file of files) {
    totalSize += file.size;
  }
  
  // التحقق من الحجم
  if (totalSize > siteConfig.maxFileSize) {
    elements.fileSizeWarning.textContent = `❗ تجاوزت الحد المسموح (20GB) - الحجم الكلي: ${formatSize(totalSize)}`;
    elements.fileSizeWarning.style.display = 'block';
    return;
  } else {
    elements.fileSizeWarning.style.display = 'none';
  }
  
  // رفع الملفات
  uploadFiles(files);
});

function uploadFiles(files) {
  // محاكاة عملية الرفع (تستبدل بكواد الرفع الفعلي)
  console.log("جاري رفع الملفات:", files);
  alert(`تم بدء رفع ${files.length} ملف(ات)`);
}

function formatSize(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + "GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + "MB";
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + "KB";
  return bytes + "بايت";
}

// التحكم في الجلسة
let sessionTimer;

function startSessionTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    appState.isAdmin = false;
    alert("انتهت الجلسة بسبب عدم النشاط");
    location.reload();
  }, siteConfig.sessionTimeout * 60 * 1000);
}

// عرض لوحة التحكم
function showAdminPanel() {
  document.getElementById('login-screen').style.display = 'none';
  elements.adminPanel.style.display = 'block';
  
  // تحديث واجهة الإدمن
  updateAdminUI();
}

function updateAdminUI() {
  // هنا تكتب كود تحديث واجهة الإدمن
}

// حماية الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (!appState.isAdmin) {
    document.getElementById('admin-panel').style.display = 'none';
  }
});

// منع الوصول إلى المتغيرات من الكونسول
(() => {
  const originalConsole = console.log;
  console.log = function(...args) {
    if (args.some(arg => typeof arg === 'string' && arg.includes(siteConfig.admin.password))) {
      return; // منع عرض كلمة السر في الكونسول
    }
    originalConsole.apply(console, args);
  };
})();
