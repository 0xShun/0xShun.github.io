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
    if (mobileMenu.classList.contains('active')) closeMobileMenu();
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
    mobileSearchBtn.focus();
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
    const searchData = window.siteSearchData;
    mobileSearchResults.replaceChildren();

    if (searchData.status !== 'ready') {
      const hint = document.createElement('div');
      hint.className = 'mobile-search-hint';
      hint.textContent = searchData.status === 'loading' ? 'Loading search index...' :
        'Post search is unavailable. Please try again later.';
      mobileSearchResults.appendChild(hint);
    }
    
    if (results.length === 0) {
      if (searchData.status === 'ready') {
        const hint = document.createElement('div');
        hint.className = 'mobile-search-hint';
        hint.textContent = `No results found for "${query}"`;
        mobileSearchResults.appendChild(hint);
      }
      return;
    }

    results.forEach(result => {
      const link = document.createElement('a');
      link.href = result.url;
      link.className = 'mobile-search-item';
      const title = document.createElement('div');
      title.className = 'mobile-search-item-title';
      title.textContent = result.title;
      const meta = document.createElement('div');
      meta.className = 'mobile-search-item-meta';
      meta.textContent = `${result.type} • ${result.date || 'Page'}`;
      link.append(title, meta);
      mobileSearchResults.appendChild(link);
    });
  }

  /**
   * Search site content
   */
  function searchSiteContent(query) {
    const results = [];
    
    // Search posts
    if (window.siteSearchData.posts) {
      window.siteSearchData.posts.forEach(post => {
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
    const pages = window.siteSearchData.pages;

    pages.forEach(page => {
      if (page.title.toLowerCase().includes(query)) {
        results.push({ ...page, type: 'Page' });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
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

    document.addEventListener('site-search-ready', function() {
      if (mobileSearchModal.classList.contains('active')) handleMobileSearch();
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
        if (mobileSearchModal.classList.contains('active')) closeMobileSearch();
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
