/**
 * Gallery Page JavaScript
 * Handles filtering, lightbox, and image interactions
 */

(function() {
  'use strict';

  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  /**
   * Filter Gallery Items
   */
  function filterGallery(category) {
    galleryItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (category === 'all' || itemCategory === category) {
        item.style.display = 'block';
        // Animate in
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  /**
   * Open Lightbox
   */
  function openLightbox(imageSrc, title) {
    lightbox.classList.add('active');
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = title;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close Lightbox
   */
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Initialize Event Listeners
   */
  function init() {
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter gallery
        const category = button.getAttribute('data-filter');
        filterGallery(category);
      });
    });

    // Gallery items - open lightbox on click
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent;
        const fullSrc = img.src;
        openLightbox(fullSrc, title);
      });
    });

    // Close lightbox
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox on background click
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
