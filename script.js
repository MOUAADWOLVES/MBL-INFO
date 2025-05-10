// كلمة مرور الإدمن (يمكن تغييرها)
const ADMIN_PASSWORD = "MBL@2025";

// عناصر DOM
const loginScreen = document.getElementById('loginScreen');
const visitorView = document.getElementById('visitorView');
const adminPanel = document.getElementById('adminPanel');
const publicContent = document.getElementById('publicContent');
const adminContent = document.getElementById('adminContent');
const contentEditor = document.getElementById('contentEditor');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');

// بيانات الموقع
let siteData = {
    content: "<h2>مرحبًا بكم في MBL INFO 🏴‍☠️</h2><p>سيتم عرض المحتوى هنا قريبًا...</p>",
    files: []
};

// تحميل البيانات المحفوظة
function loadData() {
    const savedData = localStorage.getItem('mbl_site_data');
    if (savedData) {
        siteData = JSON.parse(savedData);
    }
    renderContent();
}

// حفظ البيانات
function saveData() {
    localStorage.setItem('mbl_site_data', JSON.stringify(siteData));
}

// عرض المحتوى
function renderContent() {
    publicContent.innerHTML = siteData.content;
    adminContent.innerHTML = generateFilesGrid() + siteData.content;
    contentEditor.value = siteData.content;
}

// توليد شبكة الملفات
function generateFilesGrid() {
    if (siteData.files.length === 0) return '<p class="no-files">لا توجد ملفات مرفوعة بعد</p>';
    
    return `
        <div class="files-section">
            <h3><i class="fas fa-folder-open"></i> الملفات المرفوعة</h3>
            <div class="files-grid">
                ${siteData.files.map(file => `
                    <div class="admin-file-card">
                        <div class="file-thumbnail">
                            ${getFileIcon(file.type)}
                        </div>
                        <div class="file-info">
                            <h3>${file.name}</h3>
                            <div class="file-meta">
                                <span>${formatFileSize(file.size)}</span>
                                <span>${new Date(file.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="file-actions">
                            <button class="file-action-btn" onclick="deleteFile('${file.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="file-action-btn" onclick="copyLink('${file.id}')">
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// أيقونات الملفات
function getFileIcon(fileType) {
    const type = fileType.split('/')[0];
    const icons = {
        'image': 'fa-image',
        'video': 'fa-video',
        'audio': 'fa-music',
        'application': 'fa-file-alt',
        'text': 'fa-file-alt',
        'zip': 'fa-file-archive'
    };
    
    const icon = icons[type] || 'fa-file';
    return `<i class="fas ${icon}"></i>`;
}

// تنسيق حجم الملف
function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// إدارة الملفات
function handleFiles(files) {
    progressBar.style.display = 'block';
    progress.style.width = '0%';
    
    let uploadedCount = 0;
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onloadstart = () => {
            progress.style.width = `${(index / files.length) * 100}%`;
        };
        
        reader.onload = (e) => {
            uploadedCount++;
            progress.style.width = `${(uploadedCount / files.length) * 100}%`;
            
            const fileData = {
                id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                date: new Date().toISOString()
            };
            
            siteData.files.push(fileData);
            
            if (uploadedCount === files.length) {
                setTimeout(() => {
                    progressBar.style.display = 'none';
                    saveData();
                    renderContent();
                    alert(`تم رفع ${uploadedCount} ملف بنجاح!`);
                }, 500);
            }
        };
        
        reader.onerror = () => {
            alert(`حدث خطأ أثناء رفع الملف: ${file.name}`);
        };
        
        reader.readAsDataURL(file);
    });
}

// حذف ملف
function deleteFile(fileId) {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
        siteData.files = siteData.files.filter(file => file.id !== fileId);
        saveData();
        renderContent();
    }
}

// نسخ رابط الملف
function copyLink(fileId) {
    const file = siteData.files.find(f => f.id === fileId);
    if (file) {
        navigator.clipboard.writeText(file.data)
            .then(() => alert('تم نسخ رابط الملف!'))
            .catch(() => alert('تعذر نسخ الرابط'));
    }
}

// نشر المحتوى
function publishContent() {
    siteData.content = contentEditor.value;
    saveData();
    renderContent();
    showNotification('تم تحديث المحتوى بنجاح!', 'success');
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// إدارة تسجيل الدخول
function showVisitorView() {
    loginScreen.style.display = 'none';
    visitorView.style.display = 'block';
}

function showLogin() {
    visitorView.style.display = 'none';
    loginScreen.style.display = 'flex';
}

function checkAdminPass() {
    const passInput = document.getElementById('adminPass');
    if (passInput.value === ADMIN_PASSWORD) {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        showNotification('مرحبًا بك يا إدمن!', 'success');
    } else {
        showNotification('كلمة المرور خاطئة!', 'error');
    }
}

function logout() {
    adminPanel.style.display = 'none';
    showLogin();
    document.getElementById('adminPass').value = '';
}

// سحب وإسقاط الملفات
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--secondary)';
    dropZone.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ddd';
    dropZone.style.backgroundColor = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ddd';
    dropZone.style.backgroundColor = 'transparent';
    
    if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFiles(fileInput.files);
        fileInput.value = '';
    }
});

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // إضافة تأثيرات عند التحميل
    setTimeout(() => {
        document.querySelector('.login-box').style.opacity = '1';
    }, 100);
});
