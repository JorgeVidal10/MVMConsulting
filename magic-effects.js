// Efectos mágicos ultra premium para MVM Consultores

document.addEventListener('DOMContentLoaded', function() {
    
    // Observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos con animaciones
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));

    // Efecto de cursor trail mágico (solo en desktop)
    if (window.innerWidth > 768) {
        createCursorTrail();
    }

    // Activar efectos de parallax suave
    initParallaxEffects();

    // Mejorar animaciones AOS
    enhanceAOSAnimations();
    
    // Efectos de hover mágicos
    initMagicHoverEffects();
});

function createCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

function enhanceAOSAnimations() {
    // Agregar delays progresivos a las cards
    const cards = document.querySelectorAll('.services-section .card');
    cards.forEach((card, index) => {
        card.setAttribute('data-aos-delay', (index + 1) * 150);
    });

    // Efectos especiales para títulos
    const titles = document.querySelectorAll('.magic-text');
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.animationDuration = '2s';
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.animationDuration = '4s';
        });
    });
}

function initMagicHoverEffects() {
    // Efecto de brillo en botones
    const buttons = document.querySelectorAll('.btn-primary, .card-cta');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            createSparkles(e.target);
        });
    });

    // Efecto de ondas en las cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            createRippleEffect(e, card);
        });
    });
}

function createSparkles(element) {
    const sparkleCount = 6;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #60a5fa, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkleAnimation 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

function createRippleEffect(e, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Agregar keyframes para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(180deg) translateY(-20px);
            opacity: 0;
        }
    }
    
    @keyframes rippleAnimation {
        0% {
            transform: scale(0);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    .sparkle {
        box-shadow: 0 0 10px currentColor;
    }
`;

document.head.appendChild(style);

// Efecto de typing para el hero
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Efecto de conteo animado para números
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Inicializar contadores animados cuando entren en viewport
const counters = document.querySelectorAll('.stat p');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^\d]/g, ''));
            
            if (number) {
                entry.target.classList.add('animated');
                animateCounter(entry.target, number);
            }
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});
