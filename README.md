# 🏢 MVM Consultores - Website Corporativo Profesional

[![Performance](https://img.shields.io/badge/Performance-A+-green)](https://developers.google.com/speed/pagespeed/insights/)
[![Security](https://img.shields.io/badge/Security-A+-blue)](https://securityheaders.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/Accessibility-AA-orange)](https://www.w3.org/WAI/WCAG21/AA/)

Sitio web oficial de **MVM Consultores**, especialistas en transformación de empresas familiares en organizaciones de clase mundial.

## 🚀 Características Principales

### ✨ Diseño y UX
- **Diseño Responsivo**: Optimizado para móvil, tablet y desktop
- **Animaciones AOS**: Animaciones suaves y profesionales con lazy loading
- **Interfaz Intuitiva**: Navegación clara y accesible (WCAG 2.1 AA)
- **Tarjetas Interactivas**: Servicios completamente clicables con efectos 3D
- **PWA Ready**: Funcionalidad de aplicación web progresiva

### 🔧 Funcionalidades Avanzadas
- **Service Worker**: Caché inteligente y funcionamiento offline
- **Lazy Loading**: Carga optimizada de imágenes con WebP
- **Intersection Observer**: Animaciones basadas en viewport
- **Error Boundaries**: Manejo robusto de errores JavaScript
- **Background Sync**: Sincronización en segundo plano

### 📊 Optimización y Rendimiento
- **Core Web Vitals**: Monitoreo completo de LCP, FID, CLS
- **Performance Budget**: Control de recursos y tamaños
- **Critical CSS**: Estilos críticos en línea para first paint
- **Resource Hints**: Preload, prefetch y dns-prefetch
- **Compression**: Gzip/Brotli para todos los assets

### 🔒 Seguridad Enterprise
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Content Security Policy**: Protección contra XSS
- **HTTPS Enforcement**: Redirección automática a HTTPS
- **Resource Integrity**: Verificación de recursos externos
- **Privacy First**: Sin tracking innecesario

### 📈 Analytics y Monitoreo
- **Enhanced Analytics**: Métricas avanzadas de comportamiento
- **Error Tracking**: Monitoreo completo de errores
- **User Journey**: Seguimiento de interacciones del usuario
- **Performance Metrics**: Métricas de rendimiento en tiempo real
- **Business Intelligence**: KPIs específicos del negocio

## 📁 Estructura del Proyecto

```
MVMConsulting/
├── 📄 index.html                    # Página principal optimizada
├── 🎨 Estilos
│   ├── � styles.css               # Estilos principales (38KB optimizado)
│   ├── 📄 animations.css           # Animaciones personalizadas
│   ├── 📄 image-fallbacks.css      # Optimización de imágenes
│   └── 📄 image-optimization.css   # WebP y lazy loading
├── ⚡ Scripts
│   ├── 📄 script.js                # JavaScript principal (12KB)
│   ├── 📄 analytics-enhanced.js    # Analytics avanzado v2.0
│   ├── 📄 sw.js                    # Service Worker para PWA
│   └── 📄 script-debug.js          # Script de debugging
├── 🖼️ Recursos
│   ├── 📄 logo.png                 # Logo principal
│   ├── 📄 favicon.svg              # Favicon vectorial
│   └── 📁 team/                    # Fotos del equipo optimizadas
├── 🔍 SEO y PWA
│   ├── 📄 sitemap.xml              # Mapa del sitio
│   ├── 📄 robots.txt               # Directivas para crawlers
│   └── 📄 manifest.json            # Manifiesto PWA
├── ⚙️ Configuración
│   ├── 📄 .htaccess                # Configuración Apache/Nginx
│   └── 📄 jsconfig.json            # Configuración JavaScript/TypeScript
└── 📚 README.md                    # Documentación completa
```

## 🛠️ Tecnologías y Herramientas

### Frontend Stack
- **HTML5**: Semántico, accesible y SEO-optimizado
- **CSS3**: Grid, Flexbox, Custom Properties, Container Queries
- **JavaScript ES2020+**: Módulos, async/await, Intersection Observer
- **Progressive Web App**: Service Worker, Web App Manifest

### Performance Stack
- **AOS (Animate On Scroll)**: v2.3.1 con configuración optimizada
- **Font Awesome**: v6.4.0 con subset loading
- **Google Fonts**: Montserrat con display=swap
- **WebP Images**: Formato moderno con fallbacks

### Development Tools
- **VS Code**: Configuración optimizada con jsconfig.json
- **JSDoc**: Documentación inline del código
- **Performance API**: Métricas nativas del navegador
- **Chrome DevTools**: Debugging y profiling

## 📊 Métricas de Rendimiento

### Core Web Vitals (Target)
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

### Performance Metrics
- **First Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Blocking Time**: < 200ms
- **Speed Index**: < 3.0s

### Resource Budget
- **JavaScript**: < 50KB compressed
- **CSS**: < 40KB compressed
- **Images**: WebP < 500KB total
- **Fonts**: < 100KB subset

## � Instalación y Desarrollo

### Requisitos Previos
```bash
# Servidor web local (opcional)
npm install -g http-server
# o usar Python
python -m http.server 8000
```

### Configuración Local
```bash
# Clonar el repositorio
git clone https://github.com/JorgeVidal10/MVMConsulting.git
cd MVMConsulting

# Servidor de desarrollo
http-server . -p 3000 -o

# O con Python
python -m http.server 3000
```

### Scripts de Desarrollo
```bash
# Verificar performance
npm run audit:performance

# Validar HTML
npm run validate:html

# Optimizar imágenes
npm run optimize:images

# Generar reporte de accesibilidad
npm run audit:a11y
```

## 🚀 Despliegue

### Configuración de Servidor

#### Apache (.htaccess incluido)
```apache
# Headers de seguridad
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set Strict-Transport-Security "max-age=63072000"

# Compresión
AddOutputFilterByType DEFLATE text/html text/css application/javascript

# Caché
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
```

#### Nginx
```nginx
# Headers de seguridad
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header Strict-Transport-Security "max-age=63072000";

# Compresión
gzip on;
gzip_types text/css application/javascript text/html;

# Caché
location ~* \.(css|js|png|jpg|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Checklist de Producción
- [ ] Configurar HTTPS con certificado válido
- [ ] Activar compresión (Gzip/Brotli)
- [ ] Configurar headers de seguridad
- [ ] Optimizar imágenes a WebP
- [ ] Validar sitemap.xml
- [ ] Configurar analytics endpoint
- [ ] Probar PWA functionality
- [ ] Verificar performance en mobile

## � Monitoreo y Analytics

### Métricas Automáticas
```javascript
// Configurar endpoint de analytics
MVMAnalytics.config.beaconEndpoint = 'https://analytics.mvmconsultores.com/collect';

// Tracking personalizado
MVMAnalytics.trackEvent('conversion', {
  service: 'Institucionalización',
  value: 1000,
  currency: 'MXN'
});
```

### Dashboards Recomendados
- **Google Analytics 4**: Comportamiento y conversiones
- **Google Search Console**: SEO y búsquedas
- **PageSpeed Insights**: Performance metrics
- **WebPageTest**: Análisis detallado de carga

## 🔍 SEO y Marketing

### Características SEO
- **Structured Data**: Schema.org para mejor indexación
- **Open Graph**: Optimizado para redes sociales
- **Twitter Cards**: Previews enriquecidas
- **Meta Tags**: Títulos y descripciones optimizadas
- **Sitemap XML**: Estructura completa del sitio

### Marketing Features
- **WhatsApp Integration**: Botones personalizados por servicio
- **Lead Capture**: Formularios optimizados
- **Social Proof**: Testimonios y casos de éxito
- **Call-to-Actions**: Estratégicamente posicionados

## �️ Seguridad y Privacidad

### Medidas de Seguridad
- **Content Security Policy**: Prevención de XSS
- **Subresource Integrity**: Verificación de CDNs
- **HTTPS Enforcement**: Encriptación obligatoria
- **Security Headers**: Protección contra ataques comunes

### Cumplimiento de Privacidad
- **GDPR Ready**: Estructura para cumplimiento europeo
- **No Third-Party Cookies**: Respeto a la privacidad
- **Minimal Data Collection**: Solo datos necesarios
- **User Consent**: Controles granulares

## 🤝 Contribución

### Guías de Contribución
1. **Fork** el repositorio
2. **Crear branch** para nueva feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** al branch: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request** con descripción detallada

### Estándares de Código
- **ESLint**: Configuración incluida
- **Prettier**: Formato automático
- **JSDoc**: Documentación obligatoria
- **Performance Budget**: Respetar límites de recursos

## � Licencia y Contacto

### Información Legal
- **Copyright**: © 2024 MVM Consultores
- **Licencia**: Todos los derechos reservados
- **Uso**: Solo para fines autorizados

### Contacto Técnico
- **Desarrollador**: [GitHub Issues](https://github.com/JorgeVidal10/MVMConsulting/issues)
- **Email Técnico**: dev@mvmconsultores.com
- **Soporte**: support@mvmconsultores.com

### Soporte y Contacto Comercial
- **WhatsApp**: [+52 662 XXX XXXX](https://wa.me/52662XXXXXXX)
- **Email**: info@mvmconsultores.com
- **Sitio Web**: [mvmconsultores.com](https://mvmconsultores.com)

---

**Desarrollado con ❤️ para transformar empresas familiares en organizaciones de clase mundial**

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Flexbox, Grid, animaciones
- **JavaScript ES6+**: Funcionalidades modernas y optimizadas

### Librerías Externas
- **AOS (Animate On Scroll)**: Animaciones scroll-triggered
- **Font Awesome 6.4.0**: Iconografía profesional
- **Google Fonts (Montserrat)**: Tipografía corporativa

### Optimizaciones
- **Throttle/Debounce**: Optimización de eventos scroll/resize
- **Intersection Observer**: Detección eficiente de elementos visibles
- **Lazy Loading**: Carga diferida de imágenes
- **Error Boundaries**: Manejo robusto de errores

## 🚀 Instalación y Uso

### Desarrollo Local
```bash
# Clonar el repositorio
git clone https://github.com/usuario/MVMConsulting.git

# Navegar al directorio
cd MVMConsulting

# Abrir con servidor local (recomendado)
python -m http.server 8000
# o
npx serve .
# o
php -S localhost:8000
```

### Despliegue
El sitio es estático y puede desplegarse en cualquier servidor web:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3**
- **Apache/Nginx**

## 📈 Métricas de Rendimiento

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimizaciones Implementadas
- ✅ Compresión de imágenes
- ✅ Minificación de CSS/JS
- ✅ Lazy loading nativo
- ✅ Preload de recursos críticos
- ✅ Throttling de eventos scroll
- ✅ Error handling robusto

## 🔧 Configuración

### Variables CSS Principales
```css
:root {
  --primary: #003366;        /* Azul corporativo */
  --secondary: #004080;      /* Azul secundario */
  --accent: #FFC20E;         /* Dorado/amarillo */
  --dark: #1A1A1A;           /* Negro corporativo */
  --light: #FAFAFA;          /* Blanco roto */
  --text: #2C3E50;           /* Gris texto */
}
```

### Configuración WhatsApp
```javascript
// Número de contacto
const whatsappNumber = "573001234567";

// Mensajes personalizados por servicio
function openWhatsApp(service) {
  const message = `Hola, me interesa ${service}`;
  // ...
}
```

## 🎯 Servicios Disponibles

1. **📘 Institucionalización**
   - Planes de sucesión
   - Políticas empresariales
   - Sistemas de control

2. **🎯 Estrategia Empresarial**
   - Benchmarking
   - Objetivos estratégicos
   - Ventajas competitivas

3. **💰 Finanzas Corporativas**
   - Análisis financiero
   - Control de gestión
   - Planificación presupuestaria

4. **🧠 Cultura Organizacional**
   - Diagnóstico de clima
   - Programas de reconocimiento
   - Profesionalización del talento

5. **🛠️ Implementación**
   - KPIs y métricas
   - Cronogramas
   - Shadow consulting

## 🔍 SEO y Analytics

### Meta Tags Implementados
- Open Graph para redes sociales
- Twitter Cards
- Structured Data (JSON-LD)
- Meta descriptions optimizadas

### Tracking Disponible
- Performance monitoring (Core Web Vitals)
- User interaction tracking
- Error tracking
- Resource loading monitoring

## 🧪 Testing y QA

### Checklist de QA
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ Cross-browser compatibility
- ✅ Accessibility (WCAG 2.1)
- ✅ Performance (PageSpeed Insights)
- ✅ SEO (Lighthouse)
- ✅ Error handling
- ✅ Form validation
- ✅ Image fallbacks

### Herramientas de Testing
- Google PageSpeed Insights
- Lighthouse
- WAVE (Web Accessibility Evaluator)
- BrowserStack (cross-browser)

## 📞 Soporte y Contacto

### Información de Contacto
- **WhatsApp**: +52 662 720 0496
- **Email**: info@mvmconsulting.com
- **Ubicación**: Hermosillo, Sonora, México

### Equipo de Desarrollo
- **Jorge Vidal**: Consultor Senior
- **José Miranda**: Consultor Estratégico

## 📄 Licencia

© 2025 MVM Consultores. Todos los derechos reservados.

---

**Última actualización**: Enero 2025  
**Versión**: 2.0.0  
**Status**: ✅ Producción
Este es un repositorio para un proyecto de consultoría empresarial
