document.addEventListener('DOMContentLoaded', function() {
    const accessBtn = document.getElementById('accessBtn');
    const subscriptionPopup = document.getElementById('subscriptionPopup');
    const mainContent = document.getElementById('mainContent');
    
    // تغيير لون نص "اضغط هنا"
    window.changeColor = function() {
        const clickHere = document.querySelector('.click-here');
        clickHere.classList.toggle('black-white');
    };
    
    // عد تنازلي للزر
    let seconds = 5;
    const countdown = setInterval(() => {
        accessBtn.textContent = `انتظر ${seconds} ثوانٍ`;
        seconds--;
        
        if (seconds < 0) {
            clearInterval(countdown);
            accessBtn.textContent = 'الدخول إلى الموقع';
            accessBtn.classList.add('active');
            accessBtn.disabled = false;
            
            accessBtn.addEventListener('click', function() {
                subscriptionPopup.style.display = 'none';
                mainContent.style.display = 'block';
                
                // تخزين في localStorage أن المستخدم قد اشترك
                localStorage.setItem('subscribed', 'true');
            });
        }
    }, 1000);
    
    // التحقق إذا كان المستخدم قد اشترك من قبل
    if (localStorage.getItem('subscribed') === 'true') {
        subscriptionPopup.style.display = 'none';
        mainContent.style.display = 'block';
    }
});