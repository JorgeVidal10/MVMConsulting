// Inicializar AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar la librería de animaciones
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false,
    offset: 100,
    delay: 50,
  });
  
  // Toggle menú móvil
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }
    });
  });

  // Añadir clase activa en navegación según la sección visible
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
      } else {
        document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavOnScroll);

});

// Agregar estilo de enlace activo en navegación
document.addEventListener('DOMContentLoaded', function() {
  // Añadir clase activa al estilo para el enlace activo
  const styleSheet = document.styleSheets[0];
  const cssRules = `.nav-menu a.active { color: var(--primary); }
                    .nav-menu a.active::after { width: 100%; }`;
  
  if (styleSheet.insertRule) {
    styleSheet.insertRule(cssRules, styleSheet.cssRules.length);
  } else if (styleSheet.addRule) {
    styleSheet.addRule(cssRules, -1);
  }

  // Verificar que las imágenes cargan correctamente
  const aboutImage = document.querySelector('.about-image img');
  if (aboutImage) {
    aboutImage.addEventListener('error', function() {
      // Si la imagen no carga, intentar con un placeholder elegante
      this.src = 'https://via.placeholder.com/800x600/003366/FFFFFF?text=MVM+Consultores';
      this.alt = 'MVM Consultores';
      // Agregar clases para un mejor estilo
      this.classList.add('placeholder-image');
    });

    // Efectos de parallax para la imagen
    document.addEventListener('mousemove', function(e) {
      if (window.innerWidth > 768) { // Solo en pantallas grandes
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        aboutImage.style.transform = `perspective(1000px) rotateY(${mouseX * 5}deg) rotateX(${-mouseY * 5}deg) scale(1.05)`;
        aboutImage.style.transition = 'transform 0.1s ease-out';
      }
    });

    // Restablecer cuando el ratón sale del área
    document.querySelector('.about-section').addEventListener('mouseleave', function() {
      aboutImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
      aboutImage.style.transition = 'transform 0.5s ease-out';
    });
  }
  
  // Efecto de números animados en estadísticas
  const stats = document.querySelectorAll('.stat p');
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
  const cards = document.querySelectorAll('.interactive-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth < 768) return; // Solo en pantallas grandes
      
      const cardRect = card.getBoundingClientRect();
      const cardX = e.clientX - cardRect.left;
      const cardY = e.clientY - cardRect.top;
      
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
});

// Efecto parallax avanzado para la hero section
document.addEventListener('DOMContentLoaded', function() {
  // Parallax para Hero Section
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection && window.innerWidth > 768) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.pageYOffset;
      const speed = 0.5;
      
      // Efecto de parallax en el scroll
      heroSection.style.backgroundPositionY = `${20 + scrollPosition * speed}%`;
      
      // Efecto de desvanecimiento de la hero section al hacer scroll
      if (scrollPosition < heroSection.offsetHeight) {
        const opacity = 1 - (scrollPosition / heroSection.offsetHeight * 1.5);
        heroSection.querySelector('.hero-content').style.opacity = Math.max(opacity, 0);
        heroSection.querySelector('.hero-content').style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }
    });
  }
});
