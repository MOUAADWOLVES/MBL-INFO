// نظام الإدارة لـ MBL INFO 🏴‍☠️
const siteConfig = {
  admin: {
    passwords: [
      "MBL#INFO",
      "MBL22",
      "MBL 🇨🇦 🇨🇦 🇨🇦"
    ],
    sessionToken: "mbl-auth-token-2025"
  },
  fileLimits: {
    maxSize: 30 * 1024 * 1024 * 1024, // 30GB
    minSize: 10 // 10B
  },
  sessionTimeout: 30 // دقائق
};

let appState = {
  isAdmin: false,
  content: "",
  files: [],
  searchResults: []
};

// عناصر DOM
const DOM = {
  // شاشة الدخول
  loginScreen: document.getElementById('loginScreen'),
  adminPass: document.getElementById('adminPass'),
  
  // واجهة الزوار
  visitorView: document.getElementById('visitorView'),
  searchInput: document.getElementById('searchInput'),
  searchResults: document.getElementById('searchResults'),
  publicContent: document.getElementById('publicContent'),
  
  // لوحة التحكم
  adminPanel: document.getElementById('adminPanel'),
  fileInput: document.getElementById('fileInput'),
  dropZone: document.getElementById('dropZone'),
  progressBar: document.getElementById('progressBar'),
  progress: document.getElementById('progress'),
  progressText: document.getElementById('progressText'),
  fileCount: document.getElementById('fileCount'),
  fileSize: document.getElementById('fileSize'),
  fileSizeWarning: document.getElementById('file-size-warning'),
  contentEditor: document.getElementById('contentEditor'),
  adminContent: document.getElementById('adminContent'),
  adminSearch: document.getElementById('adminSearch')
};

// تهيئة التطبيق
function init() {
  checkAuthState();
  setupEventListeners();
  loadContent();
}

// التحقق من حالة المصادقة
function checkAuthState() {
  const token = localStorage.getItem('mbl-auth-token');
  if (token === siteConfig.admin.sessionToken) {
    appState.isAdmin = true;
    showAdminPanel();
    startSessionTimer();
  } else {
    showLoginScreen();
  }
}

// تسجيل الدخول
function checkAdminPass() {
  const password = DOM.adminPass.value.trim();
  
  if (siteConfig.admin.passwords.includes(password)) {
    // مصادقة ناجحة
    appState.isAdmin = true;
    localStorage.setItem('mbl-auth-token', siteConfig.admin.sessionToken);
    showAdminPanel();
    startSessionTimer();
    showNotification("تم تسجيل الدخول بنجاح", "success");
  } else {
    showNotification("كلمة المرور غير صحيحة", "error");
    DOM.adminPass.value = "";
    DOM.adminPass.focus();
  }
}

// تسجيل الخروج
function logout() {
  appState.isAdmin = false;
  localStorage.removeItem('mbl-auth-token');
  showLoginScreen();
  showNotification("تم تسجيل الخروج بنجاح", "info");
}

// إدارة الجلسة
let sessionTimer;

function startSessionTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    logout();
    showNotification("انتهت الجلسة بسبب عدم النشاط", "warning");
  }, siteConfig.sessionTimeout * 60 * 1000);
}

// إدارة الملفات
function handleFileUpload(files) {
  let validFiles = [];
  let totalSize = 0;
  
  // تحقق من الملفات
  Array.from(files).forEach(file => {
    if (file.size < siteConfig.fileLimits.minSize) {
      showNotification(`تم تخطي الملف ${file.name} (حجم صغير جدًا)`, "warning");
      return;
    }
    
    if (file.size > siteConfig.fileLimits.maxSize) {
      showNotification(`تم تخطي الملف ${file.name} (يتجاوز الحد المسموح)`, "warning");
      return;
    }
    
    validFiles.push(file);
    totalSize += file.size;
  });
  
  if (validFiles.length === 0) return;
  
  // عرض معلومات الرفع
  DOM.progressBar.style.display = 'block';
  DOM.fileCount.textContent = `${validFiles.length} ملف`;
  DOM.fileSize.textContent = formatFileSize(totalSize);
  
  // محاكاة عملية الرفع (تستبدل بالرفع الفعلي)
  simulateUpload(validFiles);
}

function simulateUpload(files) {
  let uploaded = 0;
  const total = files.length;
  
  const uploadInterval = setInterval(() => {
    uploaded++;
    const percent = Math.round((uploaded / total) * 100);
    DOM.progress.style.width = `${percent}%`;
    DOM.progressText.textContent = `${percent}%`;
    
    if (uploaded === total) {
      clearInterval(uploadInterval);
      setTimeout(() => {
        files.forEach(file => {
          appState.files.push({
            id: generateFileId(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          });
        });
        
        saveContent();
        renderFiles();
        showNotification(`تم رفع ${total} ملف بنجاح`, "success");
        resetUploadUI();
      }, 500);
    }
  }, 300);
}

function resetUploadUI() {
  setTimeout(() => {
    DOM.progress.style.width = "0%";
    DOM.progressBar.style.display = 'none';
    DOM.fileInput.value = "";
  }, 2000);
}

// إدارة المحتوى
function loadContent() {
  const savedData = localStorage.getItem('mbl-content');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      appState.content = data.content || "";
      appState.files = data.files || [];
    } catch (e) {
      console.error("Error loading content:", e);
    }
  }
  
  renderContent();
}

function saveContent() {
  const data = {
    content: appState.content,
    files: appState.files
  };
  
  localStorage.setItem('mbl-content', JSON.stringify(data));
}

function publishContent() {
  appState.content = DOM.contentEditor.value;
  saveContent();
  showNotification("تم تحديث المحتوى بنجاح", "success");
}

// البحث
function searchContent() {
  const query = DOM.searchInput.value.trim().toLowerCase();
  
  if (!query) {
    appState.searchResults = [];
    renderSearchResults();
    return;
  }
  
  // البحث في الملفات
  appState.searchResults = appState.files.filter(file => 
    file.name.toLowerCase().includes(query)
  );
  
  renderSearchResults();
}

function adminSearch() {
  const query = DOM.adminSearch.value.trim().toLowerCase();
  renderFiles(query);
}

// عرض المحتوى
function renderContent() {
  if (appState.isAdmin) {
    DOM.contentEditor.value = appState.content;
    renderFiles();
  }
  
  renderPublicContent();
}

function renderPublicContent() {
  if (appState.searchResults.length > 0) {
    renderSearchResults();
  } else {
    DOM.publicContent.innerHTML = `
      <div class="welcome-message">
        <h2><i class="fas fa-compass"></i> مرحبًا بك في أرشيف MBL</h2>
        <p>استخدم مربع البحث أعلاه للعثور على الملفات والمحتوى المطلوب</p>
      </div>
    `;
  }
}

function renderFiles(searchQuery = "") {
  let filesToDisplay = appState.files;
  
  if (searchQuery) {
    filesToDisplay = appState.files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (filesToDisplay.length === 0) {
    DOM.adminContent.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>لا توجد ملفات متاحة</p>
      </div>
    `;
    return;
  }
  
  DOM.adminContent.innerHTML = filesToDisplay.map(file => `
    <div class="file-card">
      <div class="file-thumbnail">
        ${getFileIcon(file.type)}
        <span class="file-type-badge">${getFileType(file.type)}</span>
      </div>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-meta">
          <span>${formatFileSize(file.size)}</span>
          <span>${formatDate(file.uploadedAt)}</span>
        </div>
        <div class="file-actions">
          <button class="file-action download">
            <i class="fas fa-download"></i> تنزيل
          </button>
          <button class="file-action delete" onclick="deleteFile('${file.id}')">
            <i class="fas fa-trash"></i> حذف
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSearchResults() {
  if (appState.searchResults.length === 0) {
    DOM.searchResults.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <p>لا توجد نتائج مطابقة</p>
      </div>
    `;
    return;
  }
  
  DOM.searchResults.innerHTML = appState.searchResults.map(file => `
    <div class="file-card">
      <div class="file-thumbnail">
        ${getFileIcon(file.type)}
        <span class="file-type-badge">${getFileType(file.type)}</span>
      </div>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-meta">
          <span>${formatFileSize(file.size)}</span>
          <span>${formatDate(file.uploadedAt)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// إدارة الواجهة
function showLoginScreen() {
  DOM.loginScreen.style.display = 'flex';
  DOM.visitorView.style.display = 'none';
  DOM.adminPanel.style.display = 'none';
}

function showVisitorView() {
  DOM.loginScreen.style.display = 'none';
  DOM.adminPanel.style.display = 'none';
  DOM.visitorView.style.display = 'block';
  renderPublicContent();
}

function showAdminPanel() {
  DOM.loginScreen.style.display = 'none';
  DOM.visitorView.style.display = 'none';
  DOM.adminPanel.style.display = 'block';
  renderContent();
}

function showLogin() {
  showLoginScreen();
}

// أدوات مساعدة
function generateFileId() {
  return 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function formatFileSize(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + " MB";
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + " KB";
  return bytes + " بايت";
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ar-EG', options);
}

function getFileIcon(type) {
  const fileType = type.split('/')[0];
  const icons = {
    image: 'fa-image',
    video: 'fa-video',
    audio: 'fa-music',
    application: 'fa-file-alt',
    text: 'fa-file-alt'
  };
  return `<i class="fas ${icons[fileType] || 'fa-file'}"></i>`;
}

function getFileType(type) {
  const types = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'application/zip': 'ZIP',
    'application/x-rar-compressed': 'RAR',
    'application/pdf': 'PDF'
  };
  return types[type] || type.split('/')[1] || 'ملف';
}

function showNotification(message, type = "info") {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${
      type === 'success' ? 'fa-check-circle' :
      type === 'error' ? 'fa-exclamation-circle' :
      type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'
    }"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
  // سحب وإسقاط الملفات
  if (DOM.dropZone) {
    DOM.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      DOM.dropZone.classList.add('dragover');
    });
    
    DOM.dropZone.addEventListener('dragleave', () => {
      DOM.dropZone.classList.remove('dragover');
    });
    
    DOM.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      DOM.dropZone.classList.remove('dragover');
      handleFileUpload(e.dataTransfer.files);
    });
  }
  
  // اختيار الملفات
  if (DOM.fileInput) {
    DOM.fileInput.addEventListener('change', () => {
      if (DOM.fileInput.files.length > 0) {
        handleFileUpload(DOM.fileInput.files);
      }
    });
  }
  
  // البحث في واجهة الزوار
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        searchContent();
      }
    });
  }
  
  // البحث في لوحة التحكم
  if (DOM.adminSearch) {
    DOM.adminSearch.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        adminSearch();
      }
    });
  }
}

// جعل الدوال متاحة عالمياً
window.checkAdminPass = checkAdminPass;
window.showVisitorView = showVisitorView;
window.showLogin = showLogin;
window.logout = logout;
window.publishContent = publishContent;
window.searchContent = searchContent;
window.adminSearch = adminSearch;
window.deleteFile = function(id) {
  if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
    appState.files = appState.files.filter(file => file.id !== id);
    saveContent();
    renderFiles();
    showNotification("تم حذف الملف", "success");
  }
};

// بدء التطبيق
document.addEventListener('DOMContentLoaded', init);
