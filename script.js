/**
 * Main JavaScript File
 * Handles navigation, animations, form handling, and scroll effects
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js scene
    if (typeof initThreeScene === 'function') {
        initThreeScene();
    }
    
    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initScrollAnimations();
    }
    
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initSkillCards();
    initContactForm();
    initRevealText();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add scrolled class on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// GSAP Scroll Animations
// ============================================
function initScrollAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        gsap.fromTo(section.children,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Animate skill cards with stagger
    const skillCards = document.querySelectorAll('.skill-card');
    
    if (skillCards.length > 0) {
        gsap.from(skillCards, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 80%'
            }
        });
    }
    
    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards.length > 0) {
        gsap.from(projectCards, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%'
            }
        });
    }
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        timelineItems.forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%'
                }
            });
        });
    }
    
    // Animate contact form
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        gsap.from(contactForm, {
            opacity: 0,
            x: 50,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-wrapper',
                start: 'top 80%'
            }
        });
    }
    
    // Animate contact info
    const contactInfo = document.querySelector('.contact-info');
    
    if (contactInfo) {
        gsap.from(contactInfo, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-wrapper',
                start: 'top 80%'
            }
        });
    }
}

// ============================================
// Skill Cards Tilt Effect
// ============================================
function initSkillCards() {
    const skillCards = document.querySelectorAll('[data-tilt]');
    
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// Contact Form Handling
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Get form values
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simulate form submission (replace with actual API call)
            try {
                await simulateFormSubmission({ name, email, message });
                
                // Show success state
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                
                // Reset form
                form.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                // Show error state
                submitBtn.innerHTML = '<span>Error! Try Again</span><i class="fas fa-exclamation"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
}

// Simulate form submission (replace with actual backend integration)
async function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve({ success: true });
        }, 1500);
    });
}

// ============================================
// Reveal Text Animation
// ============================================
function initRevealText() {
    const revealText = document.querySelector('.reveal-text');
    
    if (revealText && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: revealText,
            start: 'top 80%',
            onEnter: () => {
                revealText.classList.add('active');
            }
        });
    }
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// Active Navigation Link Highlighting
// ============================================
window.addEventListener('scroll', throttle(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}, 100));

// ============================================
// Cursor Glow Effect (Desktop Only)
// ============================================
if (window.matchMedia('(min-width: 768px)').matches) {
    document.addEventListener('mousemove', (e) => {
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.style.position = 'fixed';
        cursorGlow.style.width = '200px';
        cursorGlow.style.height = '200px';
        cursorGlow.style.borderRadius = '50%';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(65, 105, 225, 0.15) 0%, transparent 70%)';
        cursorGlow.style.pointerEvents = 'none';
        cursorGlow.style.zIndex = '-1';
        cursorGlow.style.transform = 'translate(-50%, -50%)';
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(cursorGlow);
        
        setTimeout(() => {
            cursorGlow.style.opacity = '0';
            setTimeout(() => cursorGlow.remove(), 300);
        }, 100);
    });
}

// ============================================
// Performance Optimization
// ============================================

// Lazy load images when they come into viewport
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ============================================
// Console Branding
// ============================================
console.log('%c🚀 Mr. Capital Portfolio', 'font-size: 20px; font-weight: bold; color: #4169E1;');
console.log('%cBuilt with ❤️ using HTML, CSS, JavaScript, Three.js & GSAP', 'font-size: 12px; color: #00FFFF;');
