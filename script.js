// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// Form submission with mailto
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !message) {
        formMessage.textContent = 'الرجاء ملء جميع الحقول المطلوبة';
        formMessage.className = 'form-message error';
        return;
    }
    
    // Create mailto link
    const subject = `رسالة جديدة من ${name}`;
    const body = `المرسل: ${name}%0D%0Aالبريد الإلكتروني: ${email}%0D%0A%0D%0A${message}`;
    const mailtoLink = `mailto:vbb3476746098@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    formMessage.textContent = 'جاري فتح بريدك الإلكتروني لإرسال الرسالة...';
    formMessage.className = 'form-message success';
    document.getElementById('contactForm').reset();
    
    // Fallback message
    setTimeout(() => {
        formMessage.textContent += ' إذا لم يفتح التطبيق، يرجى إرسال الرسالة يدوياً.';
    }, 3000);
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about-content, .skill-card, .tool-card, .contact-content');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.about-content, .skill-card, .tool-card, .contact-content');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    setTimeout(() => {
        animateOnScroll();
    }, 500);
});

window.addEventListener('scroll', animateOnScroll);
