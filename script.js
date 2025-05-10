// كلمة مرور الإدمن (يمكن تغييرها)
const ADMIN_PASSWORD = "MBL12345";

// عناصر DOM
const loginScreen = document.getElementById('loginScreen');
const visitorView = document.getElementById('visitorView');
const adminPanel = document.getElementById('adminPanel');
const publicContent = document.getElementById('publicContent');
const adminContent = document.getElementById('adminContent');
const contentEditor = document.getElementById('contentEditor');

// تحميل المحتوى المحفوظ
let savedContent = localStorage.getItem('mbl_content') || 
                  "<h2>مرحبًا بكم في MBL INFO</h2><p>سيتم عرض المحتوى هنا</p>";

// عرض واجهة الزوار
function showVisitorView() {
    loginScreen.style.display = 'none';
    visitorView.style.display = 'block';
    publicContent.innerHTML = savedContent;
}

// عرض شاشة الدخول
function showLogin() {
    visitorView.style.display = 'none';
    loginScreen.style.display = 'flex';
}

// تسجيل دخول الإدمن
function checkAdminPass() {
    const passInput = document.getElementById('adminPass');
    if (passInput.value === ADMIN_PASSWORD) {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        adminContent.innerHTML = savedContent;
    } else {
        alert("كلمة المرور خاطئة!");
    }
}

// نشر محتوى جديد
function publishContent() {
    savedContent = contentEditor.value;
    localStorage.setItem('mbl_content', savedContent);
    adminContent.innerHTML = savedContent;
    publicContent.innerHTML = savedContent;
    alert("تم النشر بنجاح!");
}

// تسجيل خروج الإدمن
function logout() {
    adminPanel.style.display = 'none';
    showLogin();
}

// تحميل أولي
window.onload = function() {
    publicContent.innerHTML = savedContent;
};
