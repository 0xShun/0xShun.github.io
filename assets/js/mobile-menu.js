/**
 * Mobile Menu and Swipe Gesture Handler
 * Handles hamburger menu toggle, mobile search, and swipe gestures
 */

(function() {
  'use strict';

  // Mobile Menu Elements
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileSearchBtn = document.getElementById('openMobileSearch');
  const mobileSearchModal = document.getElementById('mobileSearchModal');
  const mobileSearchClose = document.getElementById('closeMobileSearch');
  const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileSearchResults = document.getElementById('mobileSearchResults');

  // Swipe gesture variables
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;

  /**
   * Toggle Mobile Menu
   */
  function toggleMobileMenu() {
    const isActive = mobileMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    if (isActive) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * Close Mobile Menu
   */
  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('modal-open');
  }

  /**
   * Open Mobile Search
   */
  function openMobileSearch() {
    mobileSearchModal.classList.add('active');
    document.body.classList.add('modal-open');
    // Focus on search input
    setTimeout(() => {
      mobileSearchInput.focus();
    }, 100);
  }

  /**
   * Close Mobile Search
   */
  function closeMobileSearch() {
    mobileSearchModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    mobileSearchInput.value = '';
    mobileSearchResults.innerHTML = '<div class="mobile-search-hint">Type to search posts, pages, and more...</div>';
  }

  /**
   * Handle Mobile Search Input
   */
  function handleMobileSearch() {
    const query = mobileSearchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
      mobileSearchResults.innerHTML = '<div class="mobile-search-hint">Type to search posts, pages, and more...</div>';
      return;
    }

    // Search through site data (posts, pages, etc.)
    const results = searchSiteContent(query);
    
    if (results.length === 0) {
      mobileSearchResults.innerHTML = '<div class="mobile-search-hint">No results found for "' + query + '"</div>';
      return;
    }

    // Display results
    let html = '';
    results.forEach(result => {
      html += `
        <a href="${result.url}" class="mobile-search-item">
          <div class="mobile-search-item-title">${highlightText(result.title, query)}</div>
          <div class="mobile-search-item-meta">${result.type} • ${result.date || 'Page'}</div>
        </a>
      `;
    });
    
    mobileSearchResults.innerHTML = html;
  }

  /**
   * Search site content
   */
  function searchSiteContent(query) {
    const results = [];
    
    // Search posts
    if (window.siteData && window.siteData.posts) {
      window.siteData.posts.forEach(post => {
        if (post.title.toLowerCase().includes(query)) {
          results.push({
            title: post.title,
            url: post.url,
            type: 'Post',
            date: post.date || ''
          });
        }
      });
    }

    // Search pages
    const pages = [
      { title: 'Home', url: '/', type: 'Page' },
      { title: 'About', url: '/about', type: 'Page' },
      { title: 'Projects', url: '/projects', type: 'Page' },
      { title: 'Research', url: '/research', type: 'Page' },
      { title: 'Tags', url: '/tags', type: 'Page' },
      { title: 'Archives', url: '/archives', type: 'Page' }
    ];

    pages.forEach(page => {
      if (page.title.toLowerCase().includes(query)) {
        results.push(page);
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }

  /**
   * Highlight search query in text
   */
  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="color: var(--accent-primary); font-weight: bold;">$1</span>');
  }

  /**
   * Handle Touch Start for Swipe Gestures
   */
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }

  /**
   * Handle Touch End for Swipe Gestures
   */
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }

  /**
   * Determine Swipe Direction and Action
   */
  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Swipe must be at least minSwipeDistance pixels
    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
      return;
    }

    // Determine if swipe is more horizontal or vertical
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Swipe right - close menu if open
        if (mobileMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      } else {
        // Swipe left - you can add functionality here if needed
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe down - close modals
        if (mobileSearchModal.classList.contains('active')) {
          closeMobileSearch();
        }
        if (mobileMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      }
    }
  }

  /**
   * Initialize Event Listeners
   */
  function init() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on a link
    if (mobileMenu) {
      const menuLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
      menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // Mobile search
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', openMobileSearch);
    }

    if (mobileSearchClose) {
      mobileSearchClose.addEventListener('click', closeMobileSearch);
    }

    if (mobileSearchOverlay) {
      mobileSearchOverlay.addEventListener('click', closeMobileSearch);
    }

    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', handleMobileSearch);
      
      // Close on Enter if there's a single result
      mobileSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          const firstResult = mobileSearchResults.querySelector('.mobile-search-item');
          if (firstResult) {
            window.location.href = firstResult.getAttribute('href');
          }
        }
      });
    }

    // Swipe gestures
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
        closeMobileSearch();
      }
    });

    // Close menu when resizing to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
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
