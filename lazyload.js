// LazyLoad.js - Simple lazy loading of images using IntersectionObserver

class LazyLoad {
  constructor(options = {}) {
    // Default options
    this.options = Object.assign({
      elementsSelector: '.lazy', // Default selector for lazy-loaded elements
      threshold: 300, // Trigger loading when within 300px of the viewport
      classLoading: 'loading', // Class to add during loading
      classLoaded: 'loaded', // Class to add after loaded
      classError: 'error', // Class for error state
      callbackLoaded: null, // Callback after element has been loaded
      callbackError: null // Callback when element fails to load
    }, options);

    this.init();
  }

  init() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported in this browser.');
      return;
    }

    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      rootMargin: `${this.options.threshold}px`,
      threshold: 0.1
    });

    const elements = document.querySelectorAll(this.options.elementsSelector);
    elements.forEach(el => this.observer.observe(el)); // Observe each lazy-load element
  }

  onIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        observer.unobserve(entry.target); // Stop observing once loaded
      }
    });
  }

  loadElement(element) {
    const src = element.getAttribute('data-src');
    if (src) {
      element.classList.add(this.options.classLoading);

      const img = new Image();
      img.src = src;

      img.onload = () => {
        element.src = src; // Assign the image source
        element.classList.remove(this.options.classLoading);
        element.classList.add(this.options.classLoaded);

        if (this.options.callbackLoaded) {
          this.options.callbackLoaded(element);
        }
      };

      img.onerror = () => {
        element.classList.add(this.options.classError);

        if (this.options.callbackError) {
          this.options.callbackError(element);
        }
      };
    }
  }
}

// Initialize LazyLoad on page load
document.addEventListener("DOMContentLoaded", () => {
  const lazyLoad = new LazyLoad({
    elementsSelector: '.lazy', // Your lazy-loaded elements (e.g., images)
    threshold: 200, // Trigger the load when the element is 200px away
    callbackLoaded: (element) => {
      console.log('Loaded:', element);
    },
    callbackError: (element) => {
      console.log('Error loading:', element);
    }
  });
});
