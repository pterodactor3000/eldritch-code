// Client-side search and tag filtering for writings index.
// Uses textContent only — never innerHTML with external data.

(function () {
  const grid = document.getElementById('writings-grid');
  const searchInput = document.getElementById('writings-search');
  const tagContainer = document.getElementById('writings-tags');
  const emptyMsg = document.getElementById('writings-empty');
  if (!grid || !searchInput) return;

  let activeTag = '';
  const cards = Array.from(grid.querySelectorAll('.writings-card'));

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const searchData = (card.dataset.search || '').toLowerCase();
      const tags = (card.dataset.tags || '').split(',').filter(Boolean);
      const matchesSearch = !query || searchData.includes(query);
      const matchesTag = !activeTag || tags.includes(activeTag);
      const show = matchesSearch && matchesTag;
      card.hidden = !show;
      if (show) visible++;
    });

    if (emptyMsg) emptyMsg.hidden = visible > 0;
  }

  searchInput.addEventListener('input', applyFilters);

  if (tagContainer) {
    tagContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.writings-tag-filter');
      if (!btn) return;
      const tag = btn.dataset.tag || '';
      activeTag = activeTag === tag ? '' : tag;
      tagContainer.querySelectorAll('.writings-tag-filter').forEach((b) => {
        b.classList.toggle('active', b.dataset.tag === activeTag);
      });
      applyFilters();
    });
  }
})();
