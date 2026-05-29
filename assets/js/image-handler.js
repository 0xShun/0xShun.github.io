/**
 * Image Loading Handler
 * Handles image loading, lazy loading, and retry logic for broken images
 */

(function() {
  'use strict';

  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000; // 1 second

  /**
   * Retry loading an image
   */
  function retryImageLoad(img, retryCount = 0) {
    if (retryCount >= MAX_RETRIES) {
      handleImageError(img);
      return;
    }

    // Force reload by adding a cache-busting parameter
    const originalSrc = img.dataset.originalSrc || img.src;
    img.dataset.originalSrc = originalSrc;
    
    // Add timestamp to bypass cache
    const separator = originalSrc.includes('?') ? '&' : '?';
    img.src = originalSrc + separator + 't=' + Date.now();

    setTimeout(() => {
      if (img.naturalHeight === 0) {
        retryImageLoad(img, retryCount + 1);
      }
    }, RETRY_DELAY);
  }

  /**
   * Handle image load errors
   */
  function handleImageError(img) {
    if (img.hasAttribute('data-error-shown')) {
      return; // Already showing error
    }
    
    img.setAttribute('data-error-shown', 'true');
    
    // For imgur and external images, just hide silently
    // Don't show error messages as they clutter the UI
    img.style.display = 'none';
    
    // Only show error for local/important images
    const isLocalImage = img.src.includes(window.location.hostname) || img.src.startsWith('/');
    
    if (isLocalImage) {
      // Create error message for local images only
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        padding: 1.5rem;
        background: rgba(255, 59, 48, 0.08);
        border: 2px solid rgba(255, 59, 48, 0.3);
        border-radius: 8px;
        margin: 2rem auto;
        color: #ff6b6b;
        font-size: 0.9rem;
        text-align: center;
        max-width: 600px;
        font-family: 'Fira Code', monospace;
      `;
      
      const shortenedUrl = img.src.split('?')[0];
      errorDiv.innerHTML = `
        <strong>⚠️ Image failed to load</strong><br>
        <code style="font-size: 0.85rem; word-break: break-all; display: block; margin-top: 0.5rem;">${shortenedUrl}</code>
      `;
      
      img.parentNode.insertBefore(errorDiv, img.nextSibling);
    }
  }

  /**
   * Initialize image handling
   */
  function initializeImageHandling() {
    const images = document.querySelectorAll('img:not([data-handled])');

    images.forEach(img => {
      img.setAttribute('data-handled', 'true');
      
      // Skip if already processed
      if (img.hasAttribute('data-error-shown')) {
        return;
      }

      // Add load and error event listeners
      img.addEventListener('load', function() {
        // Image loaded successfully
        this.style.opacity = '1';
        this.removeAttribute('data-loading-error');
      }, { once: true });

      img.addEventListener('error', function() {
        retryImageLoad(this);
      }, { once: true });

      // Set initial opacity to 0
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';

      // Add loading attribute for native lazy loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Check if image is already loaded or broken
      if (img.complete) {
        if (img.naturalHeight === 0) {
          // Image failed to load or is broken
          retryImageLoad(img);
        } else {
          // Image already loaded
          img.style.opacity = '1';
        }
      } else {
        // Set timeout as backup check
        const timeoutId = setTimeout(() => {
          if (img.naturalHeight === 0 && !img.hasAttribute('data-error-shown')) {
            retryImageLoad(img);
          }
        }, 5000);

        // Clear timeout if image loads
        img.addEventListener('load', () => clearTimeout(timeoutId), { once: true });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageHandling);
  } else {
    initializeImageHandling();
  }

  // Re-initialize when new images are dynamically added
  const observer = new MutationObserver(function(mutations) {
    let hasNewImages = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') {
              hasNewImages = true;
            } else if (node.querySelectorAll) {
              const newImages = node.querySelectorAll('img:not([data-handled])');
              if (newImages.length > 0) {
                hasNewImages = true;
              }
            }
          }
        });
      }
    });

    if (hasNewImages) {
      initializeImageHandling();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
