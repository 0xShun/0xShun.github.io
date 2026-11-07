(function() {
  'use strict';

  document.querySelectorAll('.post-content table, .page-content table').forEach(table => {
    if (table.closest('.highlight')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Scrollable table');
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  document.querySelectorAll('.post-content img').forEach(image => {
    if (image.closest('a, picture')) return;
    const link = document.createElement('a');
    link.href = image.currentSrc || image.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'article-image-link';
    link.setAttribute('aria-label', `Open full-size image: ${image.alt || 'article image'}`);
    image.parentNode.insertBefore(link, image);
    link.appendChild(image);
  });
})();
