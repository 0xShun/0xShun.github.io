/**
 * Command Palette
 * Searchable modal for navigation and content discovery
 * Optimized with debouncing and real-time search
 */

(function() {
  // Get all site posts data from Jekyll
  const siteData = {
    posts: [],
    projects: [],
    research: [],
    pages: [
      { title: 'Home', url: '/', icon: '🏠', type: 'page' },
      { title: 'Posts', url: '/posts/', icon: '📝', type: 'page' },
      { title: 'Projects', url: '/projects/', icon: '🚀', type: 'page' },
      { title: 'Research', url: '/research/', icon: '📊', type: 'page' },
      { title: 'Categories', url: '/categories/', icon: '📁', type: 'page' },
      { title: 'Tags', url: '/tags/', icon: '🏷️', type: 'page' },
      { title: 'Archives', url: '/archives/', icon: '📚', type: 'page' },
      { title: 'About', url: '/about/', icon: 'ℹ️', type: 'page' }
    ]
  };

  // DOM Elements
  const modal = document.getElementById('commandPaletteModal');
  const overlay = document.getElementById('commandPaletteOverlay');
  const openBtn = document.getElementById('openCommandPalette');
  const closeBtn = document.getElementById('closeCommandPalette');
  const input = document.getElementById('commandPaletteInput');
  const searchResultsSection = document.getElementById('searchResultsSection');
  const searchResults = document.getElementById('searchResults');
  const pagesSection = document.querySelector('.command-palette-section');

  let selectedIndex = 0;
  let currentResults = [];
  let searchTimeout;

  // Debounce function for performance
  function debounce(func, wait) {
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(searchTimeout);
        func(...args);
      };
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(later, wait);
    };
  }

  // Open modal
  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    input.focus();
    // Show default pages
    pagesSection.style.display = 'block';
    searchResultsSection.style.display = 'none';
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    input.value = '';
    searchResultsSection.style.display = 'none';
    pagesSection.style.display = 'block';
    selectedIndex = 0;
  }

  // Fuzzy search function - OPTIMIZED
  function fuzzyMatch(str, pattern) {
    const lowerStr = str.toLowerCase();
    const lowerPattern = pattern.toLowerCase();
    
    // Simple substring search (faster than fuzzy for most cases)
    if (lowerStr.includes(lowerPattern)) {
      return lowerStr.indexOf(lowerPattern) === 0 ? 100 : 50;
    }
    
    return 0; // No match
  }

  // Optimized search function - REDUCED COMPUTATION
  function search(query) {
    if (!query.trim()) {
      searchResultsSection.style.display = 'none';
      pagesSection.style.display = 'block';
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];
    const maxResults = 8; // Reduced from 10

    // Search pages (fast, small dataset)
    for (let i = 0; i < siteData.pages.length; i++) {
      const page = siteData.pages[i];
      if (page.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          ...page,
          matchType: 'page',
          score: 200
        });
      }
    }

    // Search posts - SIMPLIFIED: only search title
    for (let i = 0; i < siteData.posts.length; i++) {
      const post = siteData.posts[i];
      const titleScore = fuzzyMatch(post.title, lowerQuery);
      
      if (titleScore > 0) {
        results.push({
          title: post.title,
          url: post.url,
          icon: '📝',
          type: 'post',
          date: post.date,
          matchType: 'title',
          score: titleScore
        });
      }
      
      // Stop searching if we have enough results
      if (results.length >= maxResults) break;
    }

    // Sort by score (descending) - only if we have less than max
    if (results.length > maxResults) {
      results.sort((a, b) => b.score - a.score);
      results.splice(maxResults);
    }
    
    currentResults = results;
    displayResults(currentResults);
  }

  // Debounced search - INCREASED WAIT TIME for better performance
  const debouncedSearch = debounce(search, 200);

  // Display search results - OPTIMIZED with DocumentFragment
  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
      searchResultsSection.style.display = 'block';
      pagesSection.style.display = 'none';
      return;
    }

    searchResultsSection.style.display = 'block';
    pagesSection.style.display = 'none';
    selectedIndex = 0;

    // Use DocumentFragment for faster DOM manipulation
    const fragment = document.createDocumentFragment();
    
    results.forEach((result, index) => {
      const link = document.createElement('a');
      link.href = result.url;
      link.className = 'command-palette-item' + (index === 0 ? ' selected' : '');
      link.dataset.index = index;
      
      let html = `<span class="command-icon">${result.icon}</span><span>${result.title}`;
      
      if (result.type === 'post' && result.date) {
        html += `<small style="color: var(--text-secondary); margin-left: 0.5rem;">${result.date}</small>`;
      }
      
      if (result.type === 'project' || result.type === 'research') {
        html += `<span class="result-badge">${result.type}</span>`;
      }
      
      html += '</span>';
      link.innerHTML = html;
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        window.location.href = result.url;
      });
      
      fragment.appendChild(link);
    });

    searchResults.innerHTML = '';
    searchResults.appendChild(fragment);
  }

  // Update selection
  function updateSelection(newIndex) {
    const items = searchResults.querySelectorAll('.command-palette-item');
    if (items.length === 0) return;

    // Remove old selection
    items.forEach(item => item.classList.remove('selected'));

    // Add new selection
    selectedIndex = Math.max(0, Math.min(newIndex, items.length - 1));
    items[selectedIndex].classList.add('selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // Keyboard navigation
  function handleKeydown(e) {
    if (!modal.classList.contains('active')) {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
      return;
    }

    switch(e.key) {
      case 'Escape':
        e.preventDefault();
        closeModal();
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        updateSelection(selectedIndex + 1);
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        updateSelection(selectedIndex - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        const items = searchResults.querySelectorAll('.command-palette-item');
        if (items[selectedIndex]) {
          const href = items[selectedIndex].getAttribute('href');
          closeModal();
          setTimeout(() => {
            window.location.href = href;
          }, 100);
        }
        break;
    }
  }

  // Event listeners
  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  if (input) {
    // Use input event for real-time search with debouncing
    input.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  }

  document.addEventListener('keydown', handleKeydown);

  // Load posts data from JSON
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      siteData.posts = data;
    })
    .catch(err => {
      console.log('Search data not available');
    });

  // Extract project and research data from pages (they'll be in search.json)
  // For now, we'll populate them manually based on your pages
  siteData.projects = [
    { title: 'Network Security Lab', url: '/projects/#network-security-lab' },
    { title: 'Malware Analysis Sandbox', url: '/projects/#malware-analysis-sandbox' },
    { title: 'IoT Security Framework', url: '/projects/#iot-security-framework' },
    { title: 'Threat Intelligence Platform', url: '/projects/#threat-intelligence-platform' },
    { title: 'DFIR Toolkit', url: '/projects/#dfir-toolkit' },
    { title: 'Security Monitoring Dashboard', url: '/projects/#security-monitoring-dashboard' }
  ];

  siteData.research = [
    { title: 'Anomaly Detection in High-Dimensional Network Traffic', url: '/posts/Anomaly-Detection-in-High-Dimensional-Network-Traffic-Using-Isolation-Forest/' },
    { title: 'Global Terrorism in Numbers', url: '/posts/Global-Terrorism-in-Numbers-;-Insights-Through-Data-Analytics/' },
    { title: 'Reveal - Cyberdefenders Writeup', url: '/posts/Reveal-Cyberdefenders-Writeup/' },
    { title: 'Brutus - HackTheBox', url: '/posts/Brutus-HackTheBox-Writeup/' },
    { title: 'Carnage - TryHackMe', url: '/posts/Carnage-TryHackMe/' }
  ];
})();
