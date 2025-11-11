/**
 * Content Filtering System
 * Enables filtering of posts, research, and projects by category and date
 */

(function() {
  let itemsCache = null;
  let metadataCache = null;

  // Initialize filters when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
  });

  function initializeFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;

    itemsCache = document.querySelectorAll('[data-filter-item]');
    if (itemsCache.length === 0) return;

    // Get all unique categories and years
    const categories = new Set();
    const years = new Set();

    itemsCache.forEach(item => {
      const itemCategories = item.dataset.categories?.split(',').filter(Boolean) || [];
      const itemYear = item.dataset.year || '';
      
      itemCategories.forEach(cat => categories.add(cat.trim()));
      if (itemYear) years.add(itemYear);
    });

    // Build filter UI
    buildFilterUI(filterContainer, Array.from(categories), Array.from(years).sort().reverse());
    
    // Add event listeners
    attachFilterListeners();
  }

  function buildFilterUI(container, categories, years) {
    let html = '<div class="filter-controls">';
    
    // Search box
    html += `
      <div class="filter-search">
        <input 
          type="text" 
          id="filterSearch" 
          class="filter-input" 
          placeholder="Search..."
          aria-label="Search items"
        >
      </div>
    `;

    // Category filter
    if (categories.length > 0) {
      html += '<div class="filter-group">';
      html += '<label class="filter-label">Categories:</label>';
      html += '<div class="filter-buttons">';
      html += '<button class="filter-btn filter-btn-active" data-filter-type="category" data-filter-value="all">All</button>';
      
      categories.sort().forEach(category => {
        html += `<button class="filter-btn" data-filter-type="category" data-filter-value="${category}">${category}</button>`;
      });
      
      html += '</div></div>';
    }

    // Year/Date filter
    if (years.length > 0) {
      html += '<div class="filter-group">';
      html += '<label class="filter-label">Year:</label>';
      html += '<div class="filter-buttons">';
      html += '<button class="filter-btn filter-btn-active" data-filter-type="year" data-filter-value="all">All</button>';
      
      years.forEach(year => {
        html += `<button class="filter-btn" data-filter-type="year" data-filter-value="${year}">${year}</button>`;
      });
      
      html += '</div></div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  function attachFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('filterSearch');
    
    let activeFilters = {
      categories: [],
      years: [],
      search: ''
    };

    // Filter button listeners
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterType = this.dataset.filterType;
        const filterValue = this.dataset.filterValue;

        // Update active state
        const sameTypeButtons = document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`);
        sameTypeButtons.forEach(b => b.classList.remove('filter-btn-active'));

        if (filterValue === 'all') {
          activeFilters[filterType === 'category' ? 'categories' : 'years'] = [];
        } else {
          activeFilters[filterType === 'category' ? 'categories' : 'years'] = [filterValue];
          this.classList.add('filter-btn-active');
          sameTypeButtons[0].classList.remove('filter-btn-active'); // Remove "All" active state
        }

        applyFilters(activeFilters);
      });
    });

    // Search input listener
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        activeFilters.search = this.value.toLowerCase();
        applyFilters(activeFilters);
      });
    }
  }

  function applyFilters(filters) {
    let visibleCount = 0;

    itemsCache.forEach(item => {
      let shouldShow = true;

      // Category filter
      if (filters.categories.length > 0) {
        const itemCategories = (item.dataset.categories || '').split(',').map(c => c.trim()).filter(Boolean);
        shouldShow = shouldShow && itemCategories.some(cat => filters.categories.includes(cat));
      }

      // Year filter
      if (filters.years.length > 0) {
        const itemYear = (item.dataset.year || '').trim();
        shouldShow = shouldShow && filters.years.includes(itemYear);
      }

      // Search filter
      if (filters.search && shouldShow) {
        const searchableText = (
          item.dataset.title + ' ' +
          item.dataset.excerpt
        ).toLowerCase();
        shouldShow = searchableText.includes(filters.search);
      }

      // Update visibility
      item.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleCount++;
    });

    // Show "no results" message if needed
    updateNoResultsMessage(visibleCount);
  }

  function updateNoResultsMessage(visibleCount) {
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noResultsMessage';
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.textContent = 'No items match your filters. Try adjusting your search.';
        document.querySelector('[data-filter-container]').appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }

  // Expose for global access if needed
  window.contentFilters = {
    initialize: initializeFilters
  };
})();
