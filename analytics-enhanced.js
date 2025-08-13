// Enhanced Analytics and Performance Monitoring v2.1
// Core Web Vitals, User Experience, and Business Metrics

(function() {
  'use strict';

  // Configuration
  const config = {
    enableConsoleLogging: false, // Set to false for production
    enablePerformanceAPI: true,
    enableUserBehaviorTracking: true,
    enableErrorTracking: true,
    sampleRate: 1.0, // 100% sampling for development, reduce for production
    /** @type {string|null} */
    beaconEndpoint: null // Add endpoint for production analytics
  };

  /**
   * Poly/typedefs for JS Doc to help checkJs
   * @typedef {PerformanceEntry & { value: number, hadRecentInput: boolean }} LayoutShift
   */

  /**
   * Narrow a PerformanceEntry to a PerformanceEventTiming (FID)
   * @param {PerformanceEntry} e
   * @returns {e is PerformanceEventTiming}
   */
  function isPerformanceEventTiming(e) {
    return /** @type {any} */(e).processingStart !== undefined;
  }

  /**
   * Narrow a PerformanceEntry to a LayoutShift entry (CLS)
   * @param {PerformanceEntry} e
   * @returns {e is LayoutShift}
   */
  function isLayoutShift(e) {
    return /** @type {any} */(e).value !== undefined && /** @type {any} */(e).hadRecentInput !== undefined;
  }

  /**
   * Narrow a PerformanceEntry to PerformanceResourceTiming
   * @param {PerformanceEntry} e
   * @returns {e is PerformanceResourceTiming}
   */
  function isResourceTiming(e) {
    return /** @type {any} */(e).initiatorType !== undefined;
  }

  /**
   * @param {PerformanceEntry} e
   * @returns {e is PerformanceNavigationTiming}
   */
  function isNavigationTiming(e) {
    return /** @type {any} */(e).responseStart !== undefined && /** @type {any} */(e).requestStart !== undefined;
  }

  // Core Web Vitals tracking
  function trackCoreWebVitals() {
    if (!('PerformanceObserver' in window)) return;
    try {
      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry) return;
        const lcp = lastEntry.startTime;
        if (config.enableConsoleLogging) {
          console.log('LCP:', lcp.toFixed(2) + 'ms');
        }
        sendMetric('LCP', lcp, 'ms');
        const lcpScore = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor';
        sendMetric('LCP_Score', lcpScore, 'rating');
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!isPerformanceEventTiming(entry)) continue;
          const fid = entry.processingStart - entry.startTime;
          if (config.enableConsoleLogging) {
            console.log('FID:', fid.toFixed(2) + 'ms');
          }
          sendMetric('FID', fid, 'ms');
          const fidScore = fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor';
          sendMetric('FID_Score', fidScore, 'rating');
        }
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      /** @type {LayoutShift[]} */
      let clsEntries = []; // kept for potential debugging; suppress unused warning
      // @ts-ignore - referenced for debugging purposes when console logging is enabled
      clsEntries = clsEntries;
      let sessionValue = 0;
      /** @type {LayoutShift[]} */
      let sessionEntries = [];

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!isLayoutShift(entry)) continue;
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
            if (
              sessionValue && lastSessionEntry && firstSessionEntry &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              clsEntries = [...sessionEntries]; // eslint-disable-line no-unused-vars
              if (config.enableConsoleLogging) {
                console.log('CLS:', clsValue.toFixed(4));
              }
              sendMetric('CLS', clsValue, 'score');
              const clsScore = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
              sendMetric('CLS_Score', clsScore, 'rating');
            }
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // TTFB
      new PerformanceObserver((entryList) => {
        const [entry] = entryList.getEntries();
        if (!entry || !isNavigationTiming(entry)) return;
        const ttfb = entry.responseStart;
        if (config.enableConsoleLogging) {
          console.log('TTFB:', ttfb.toFixed(2) + 'ms');
        }
        sendMetric('TTFB', ttfb, 'ms');
      }).observe({ entryTypes: ['navigation'] });

    } catch (error) {
      console.error('Error setting up Core Web Vitals tracking:', error);
    }
  }

  // Enhanced resource performance tracking
  function trackResourcePerformance() {
    if (!('PerformanceObserver' in window)) return;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!isResourceTiming(entry)) continue;
        const duration = entry.responseEnd - entry.requestStart;
        const resourceType = entry.initiatorType || 'unknown';
        sendMetric(`Resource_${resourceType}_Duration`, duration, 'ms');
        if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
          if (config.enableConsoleLogging) {
            console.log('Resource served from cache:', entry.name);
          }
          sendMetric('Cache_Hit', 1, 'count');
        }
        if (entry.transferSize > 100000) {
          sendMetric('Large_Resource', entry.transferSize, 'bytes');
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  // Page load metrics
  function trackPageLoadMetrics() {
    window.addEventListener('load', function() {
      setTimeout(() => {
        const perfData = performance.timing;
        const metrics = {
          loadTime: perfData.loadEventEnd - perfData.navigationStart,
          domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
          firstPaint: getFirstPaint(),
          firstContentfulPaint: getFirstContentfulPaint(),
          resourcesLoaded: performance.getEntriesByType('resource').length,
          memoryUsage: getMemoryUsage()
        };
        if (config.enableConsoleLogging) {
          console.log('Page Load Metrics:', metrics);
        }
        Object.entries(metrics).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            sendMetric(key, /** @type {any} */(value), getMetricUnit(key));
          }
        });
      }, 0);
    });
  }

  // User behavior tracking
  function trackUserBehavior() {
    if (!config.enableUserBehaviorTracking) return;

    // Service interaction tracking
    document.addEventListener('click', function(e) {
      const target = /** @type {Element|null} */(e.target);
      if (!target) return;

      const serviceCard = target.closest('.service-card');
      if (serviceCard) {
        const h3 = serviceCard.querySelector('h3');
        const cardTitle = h3 && h3.textContent ? h3.textContent : 'Unknown';
        if (config.enableConsoleLogging) {
          console.log('Service card clicked:', cardTitle);
        }
        sendEvent('service_card_click', { service: cardTitle });
      }

      // Navigation tracking
      const navLink = target.closest('nav a');
      if (navLink) {
        const section = navLink.getAttribute('href') || navLink.textContent || '';
        if (config.enableConsoleLogging) {
          console.log('Navigation clicked:', section);
        }
        sendEvent('navigation_click', { section: section });
      }

      // WhatsApp button tracking - Only for actual WhatsApp links
      const whatsappLink = target.closest('a[href*="wa.me"], .whatsapp-float');
      if (whatsappLink) {
        if (config.enableConsoleLogging) {
          console.log('WhatsApp button clicked');
        }
        sendEvent('whatsapp_click', { source: 'website' });
      }
    });

    // Scroll depth tracking
    let maxScrollDepth = 0;
    const scrollDepthThresholds = [25, 50, 75, 90, 100];

    window.addEventListener('scroll', throttle(() => {
      const scrollTop = window.pageYOffset;
      const documentHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
      if (scrollPercentage > maxScrollDepth) {
        const threshold = scrollDepthThresholds.find(t => scrollPercentage >= t && maxScrollDepth < t);
        if (typeof threshold === 'number') {
          maxScrollDepth = threshold;
          sendEvent('scroll_depth', { depth: threshold });
        } else {
          maxScrollDepth = scrollPercentage;
        }
      }
    }, 100), { passive: true });

    // Time on page tracking
    let startTime = Date.now();
    let isActive = true;
    // @ts-ignore - useful for future features even if not read right now
    isActive = isActive;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        const timeSpent = Date.now() - startTime;
        sendMetric('time_on_page', Math.round(timeSpent / 1000), 'seconds');
      } else {
        isActive = true;
        startTime = Date.now();
      }
    });

    // Rage clicks
    let clickCount = 0;
    /** @type {any} */
    let clickTimer;
    document.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (clickCount >= 5) {
          sendEvent('rage_clicks', { count: clickCount });
        }
        clickCount = 0;
      }, 1000);
    });
  }

  // Error tracking
  function trackErrors() {
    if (!config.enableErrorTracking) return;

    window.addEventListener('error', (e) => {
      sendEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        stack: e.error && e.error.stack ? e.error.stack : undefined
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      const reason = /** @type {any} */(e.reason);
      sendEvent('unhandled_promise_rejection', {
        reason: reason,
        stack: reason && reason.stack ? reason.stack : undefined
      });
    });

    document.addEventListener('error', (e) => {
      const target = /** @type {any} */(e.target);
      if (target && target !== window) {
        sendEvent('resource_error', {
          type: target.tagName,
          source: target.src || target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  // Helpers
  function getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  function getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  function getMemoryUsage() {
    const perfAny = /** @type {{ memory?: { usedJSHeapSize: number, totalJSHeapSize: number, jsHeapSizeLimit: number } }} */ (performance);
    if (perfAny && perfAny.memory) {
      return {
        used: perfAny.memory.usedJSHeapSize,
        total: perfAny.memory.totalJSHeapSize,
        limit: perfAny.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * @param {string} metricName
   */
  function getMetricUnit(metricName) {
    const units = {
      loadTime: 'ms',
      domReady: 'ms',
      firstPaint: 'ms',
      firstContentfulPaint: 'ms',
      resourcesLoaded: 'count',
      time_on_page: 'seconds'
    };
    return /** @type {keyof typeof units} */(metricName) in units ? /** @type {any} */(units)[metricName] : 'value';
  }

  /**
   * @param {string} name
   * @param {number|string|object} value
   * @param {string} unit
   */
  function sendMetric(name, value, unit) {
    if (Math.random() > config.sampleRate) return;
    const data = {
      type: 'metric',
      name: name,
      value: value,
      unit: unit,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    if (config.enableConsoleLogging) {
      console.log('Metric tracked:', name, value, unit);
    }
    if (config.beaconEndpoint) {
      sendToEndpoint(data);
    }
  }

  /**
   * @param {string} eventName
   * @param {Record<string, any>} [data]
   */
  function sendEvent(eventName, data = {}) {
    if (Math.random() > config.sampleRate) return;
    const eventData = {
      type: 'event',
      name: eventName,
      data: data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    if (config.enableConsoleLogging) {
      console.log('Event tracked:', eventName, data);
    }
    if (config.beaconEndpoint) {
      sendToEndpoint(eventData);
    }
  }

  /**
   * @param {any} data
   */
  function sendToEndpoint(data) {
    if (!config.beaconEndpoint) return;
    if ('sendBeacon' in navigator) {
      try {
        navigator.sendBeacon(/** @type {string} */(config.beaconEndpoint), JSON.stringify(data));
        return;
      } catch {
        // fall back to fetch
      }
    }
    fetch(/** @type {string} */(config.beaconEndpoint), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch(error => {
      if (config.enableConsoleLogging) {
        console.error('Analytics request failed:', error);
      }
    });
  }

  /**
   * @template {Function} F
   * @param {F} func
   * @param {number} limit
   * @returns {F}
   */
  function throttle(func, limit) {
    let inThrottle = false;
    // @ts-ignore - return type compatible for our usage
    return function() {
      const args = arguments;
      // @ts-ignore - not using strict this type in plain JS
      const context = this;
      if (!inThrottle) {
        // @ts-ignore
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Initialize all tracking
  function init() {
    const startAll = () => {
      trackCoreWebVitals();
      trackResourcePerformance();
      trackPageLoadMetrics();
      trackUserBehavior();
      trackErrors();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startAll);
    } else {
      startAll();
    }

    // Track page view
    sendEvent('page_view', {
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer
    });
  }

  // Public API
  // @ts-ignore
  window.MVMAnalytics = {
    trackEvent: sendEvent,
    trackMetric: sendMetric,
    config: config
  };

  // Start tracking
  init();

})();
