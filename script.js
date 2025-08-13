// Performance optimizations and error handling
(function() {
  'use strict';

  // Throttle function for scroll events
  /**
   * @template F extends (...args: any[]) => any
   * @param {F} func
   * @param {number} limit
   * @returns {F}
   */
  function throttle(func, limit) {
    let inThrottle = false;
    // @ts-ignore - return type compatible for our usage
    return function() {
      const args = arguments;
      // @ts-ignore - not typing this in JS file
      const context = this;
      if (!inThrottle) {
        // @ts-ignore
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    try {
      // Initialize AOS with error handling
      // Use window.AOS to avoid TS name lookup issues
      const aos = /** @type {any} */ (window).AOS;
      if (aos) {
        aos.init({
          duration: 800,
          easing: 'ease-out',
          once: true, // Changed to true for better performance
          offset: 100,
          delay: 50,
          disable: window.innerWidth < 768 // Disable on mobile for performance
        });
      }
      
      // Mobile menu functionality
      initializeMobileMenu();
      
      // Navigation highlighting
      initializeNavigation();
      
      // Image error handling
      initializeImageHandling();
      
      // Performance monitoring
      if ('performance' in window) {
        window.addEventListener('load', function() {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          console.log('Page load time:', loadTime + 'ms');
        });
      }
      
    } catch (error) {
      console.error('Error initializing scripts:', error);
    }
  });

  // Mobile menu functionality
  function initializeMobileMenu() {
    const menuBtn = /** @type {HTMLElement | null} */(document.getElementById('menuBtn'));
    const navMenu = /** @type {HTMLElement | null} */(document.getElementById('navMenu'));
    
    if (!menuBtn || !navMenu) return;
    
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navMenu.classList.toggle('active');
      
      // Update aria attributes for accessibility
      const isExpanded = navMenu.classList.contains('active');
      menuBtn.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      const t = /** @type {EventTarget|null} */(e.target);
      if (t instanceof Node && !navMenu.contains(t) && !menuBtn.contains(t)) {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Navigation highlighting with improved performance
  function initializeNavigation() {
    const sections = /** @type {NodeListOf<HTMLElement>} */(document.querySelectorAll('section[id]'));
    const navLinks = document.querySelectorAll('.nav-menu a[href*="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const highlightNavOnScroll = throttle(function() {
      const scrollY = window.scrollY;
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id') || '';
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        if (current && href.includes(current)) {
          link.classList.add('active');
        }
      });
    }, 100);
    
    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  }

  // Enhanced image handling with lazy loading
  function initializeImageHandling() {
    // Handle about section image
    const aboutImage = /** @type {HTMLImageElement | null} */(document.querySelector('.about-image img'));
    if (aboutImage) {
      aboutImage.addEventListener('error', function() {
        aboutImage.src = 'https://via.placeholder.com/800x600/003366/FFFFFF?text=MVM+Consultores';
        aboutImage.alt = 'MVM Consultores - Imagen de respaldo';
        aboutImage.classList.add('placeholder-image');
      });

      // Optimized parallax effect
      const aboutSection = document.querySelector('.about-section');
      if (aboutSection && window.innerWidth > 768) {
        // @ts-ignore - callback param typed inside as MouseEvent
        const handleMouseMove = throttle(function(e) {
          const me = /** @type {MouseEvent} */(e);
          const rect = aboutSection.getBoundingClientRect();
          const mouseX = (me.clientX - rect.left) / rect.width - 0.5;
          const mouseY = (me.clientY - rect.top) / rect.height - 0.5;
          
          aboutImage.style.transform = `perspective(1000px) rotateY(${mouseX * 3}deg) rotateX(${-mouseY * 3}deg) scale(1.02)`;
        }, 16);

        aboutSection.addEventListener('mousemove', handleMouseMove);
        aboutSection.addEventListener('mouseleave', function() {
          aboutImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
        });
      }
    }

    // Lazy loading for team images
    const teamImages = /** @type {NodeListOf<HTMLImageElement>} */(document.querySelectorAll('.team-photo img'));
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = /** @type {HTMLImageElement} */(entry.target);
            img.addEventListener('error', function() {
              img.src = 'https://via.placeholder.com/300x300/003366/FFFFFF?text=Team+Member';
              img.alt = 'Miembro del equipo';
            });
            observer.unobserve(img);
          }
        });
      });

      teamImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  // Efecto de números animados en estadísticas
  const stats = /** @type {NodeListOf<HTMLElement>} */(document.querySelectorAll('.stat p'));
  let animated = false;
  
  function animateStats() {
    if (animated) return;
    
    stats.forEach(stat => {
      const value = stat.innerText;
      const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      let startValue = 0;
      
      // Determinar si es un valor con signo
      const prefix = value.includes('+') ? '+' : '';
      const suffix = value.includes('MXN') ? ' mil millones MXN' : 
                    value.includes('MDD') ? ' MDD' : 
                    value.includes('%') ? '%' : '';
      
      const duration = 1500;
      const counter = setInterval(() => {
        startValue += numericValue / (duration / 30);
        if (startValue > numericValue) {
          startValue = numericValue;
          clearInterval(counter);
        }
        stat.innerText = prefix + startValue.toFixed(value.includes('.') ? 2 : 0) + suffix;
      }, 30);
    });
    
    animated = true;
  }
  
  // Observer para activar la animación cuando las stats estén visibles
  const statsSection = document.querySelector('.insights-section');
  if (statsSection) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateStats, 500);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection);
  }
  
  // Efecto 3D en las tarjetas interactivas
  const cards = /** @type {NodeListOf<HTMLElement>} */(document.querySelectorAll('.interactive-card'));
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth < 768) return; // Solo en pantallas grandes
      
      const me = /** @type {MouseEvent} */(e);
      const cardRect = card.getBoundingClientRect();
      const cardX = me.clientX - cardRect.left;
      const cardY = me.clientY - cardRect.top;
      
      // Calcular la posición relativa del ratón dentro de la tarjeta
      const xRotation = ((cardY - cardRect.height / 2) / cardRect.height) * 10;
      const yRotation = ((cardRect.width / 2 - cardX) / cardRect.width) * 10;
      
      // Aplicar transformación 3D
      card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.03)`;
      
      // Efecto de brillo basado en la posición del ratón
      const glareX = ((cardX / cardRect.width) * 100).toFixed(2);
      const glareY = ((cardY / cardRect.height) * 100).toFixed(2);
      
      card.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%), var(--light)`;
    });
    
    // Restaurar al estado normal al salir
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.background = '';
    });
    
    // Efecto de click
    card.addEventListener('click', () => {
      // Añadir animación de ondas al hacer click
      const ripple = document.createElement('span');
      ripple.classList.add('card-ripple');
      card.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 800);
    });
  });
})();

// Efecto parallax avanzado para la hero section
document.addEventListener('DOMContentLoaded', function() {
  // Parallax para Hero Section
  const heroSection = /** @type {HTMLElement | null} */(document.querySelector('.hero-section'));
  
  if (heroSection && window.innerWidth > 768) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.pageYOffset;
      const speed = 0.5;
      
      // Efecto de parallax en el scroll
      heroSection.style.backgroundPositionY = `${20 + scrollPosition * speed}%`;
      
      // Efecto de desvanecimiento de la hero section al hacer scroll
      if (scrollPosition < heroSection.offsetHeight) {
        const opacity = 1 - (scrollPosition / heroSection.offsetHeight * 1.5);
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent instanceof HTMLElement) {
          heroContent.style.opacity = String(Math.max(opacity, 0));
          heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
      }
    });
  }
});
