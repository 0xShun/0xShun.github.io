/**
 * Card Clickability Handler
 * Makes all .card and .project-card elements fully clickable
 * Extracts primary link from card and navigates on card click
 */

(function() {
  'use strict';

  /**
   * Extract the primary link from a card
   * Looks for: data-href, first <a> tag, or fallback link
   */
  function getPrimaryLink(cardElement) {
    // Check for explicit data-href attribute
    const dataHref = cardElement.getAttribute('data-href');
    if (dataHref) return dataHref;

    // Find the first anchor tag (usually the title or primary link)
    const firstLink = cardElement.querySelector('a');
    if (firstLink && firstLink.href) {
      return firstLink.href;
    }

    return null;
  }

  /**
   * Handle card click - navigate to primary link
   */
  function handleCardClick(event) {
    // Don't trigger if clicking on interactive elements
    const clickedElement = event.target;
    
    // Skip if clicking on button, input, or other interactive elements
    if (clickedElement.closest('button') || 
        clickedElement.closest('input') || 
        clickedElement.closest('a')) {
      return;
    }

    const card = event.currentTarget;
    const url = getPrimaryLink(card);

    if (url) {
      // Use window.location to navigate (respects new tab/ctrl+click)
      // For regular clicks, we navigate directly
      if (event.ctrlKey || event.metaKey || event.which === 2) {
        // Open in new tab
        window.open(url, '_blank');
      } else {
        // Regular navigation
        window.location.href = url;
      }
    }
  }

  /**
   * Initialize card clickability
   */
  function initializeCardClickability() {
    // Get all cards and project cards
    const cards = document.querySelectorAll('.card, .project-card');

    cards.forEach(card => {
      // Check if card already has a click handler
      if (getPrimaryLink(card)) {
        // Set cursor to pointer
        card.style.cursor = 'pointer';

        // Add click event listener
        card.addEventListener('click', handleCardClick);

        // Make keyboard accessible (for screen readers)
        if (!card.getAttribute('role')) {
          card.setAttribute('role', 'button');
          card.setAttribute('tabindex', '0');
          
          // Allow Enter/Space key to activate
          card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleCardClick({ 
                currentTarget: card,
                target: card,
                ctrlKey: false,
                metaKey: false,
                which: 1
              });
            }
          });
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCardClickability);
  } else {
    initializeCardClickability();
  }

  // Re-initialize on dynamic content updates (for pages that load content dynamically)
  const observer = new MutationObserver(function(mutations) {
    // Check if new cards were added
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        initializeCardClickability();
      }
    });
  });

  // Observe the document for new cards
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
