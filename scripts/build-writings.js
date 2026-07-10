import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL,
  loadPosts,
  buildPostCard,
  buildHomePostCard,
  buildTagFilters,
  buildTagHtml,
  buildRelatedHtml,
  buildPostUrl,
  buildWritingsIndexUrl,
  buildSitemapXml,
  buildRssFeed,
  findRelated,
  fillTemplate,
  escapeHtml,
} from './lib/writings-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const WRITINGS_DIR = path.join(ROOT, 'writings');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const HOME_PAGE_PATH = path.join(ROOT, 'index.html');
const HOME_PREVIEW_LIMIT = 6;
const HOME_PREVIEW_MARKER_PATTERN = /(<!-- WRITINGS_PREVIEW:START -->)[\s\S]*?(<!-- WRITINGS_PREVIEW:END -->)/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanWritingsDir() {
  if (fs.existsSync(WRITINGS_DIR)) {
    fs.rmSync(WRITINGS_DIR, { recursive: true });
  }
  ensureDir(WRITINGS_DIR);
}

function writeWritingsClientScript() {
  const script = `// Client-side search and tag filtering for writings index.
// Uses textContent only - never innerHTML with external data.

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
`;

  fs.writeFileSync(path.join(WRITINGS_DIR, 'writings.js'), script);
}

function updateHomePageWritingsPreview(posts) {
  const homeHtml = fs.readFileSync(HOME_PAGE_PATH, 'utf8');

  if (!HOME_PREVIEW_MARKER_PATTERN.test(homeHtml)) {
    throw new Error(
      `Could not find WRITINGS_PREVIEW:START/END markers in ${HOME_PAGE_PATH}. Add them around the writings grid to enable the homepage preview sync.`
    );
  }

  const preview = posts.slice(0, HOME_PREVIEW_LIMIT).map(buildHomePostCard).join('\n        ');
  const updatedHtml = homeHtml.replace(HOME_PREVIEW_MARKER_PATTERN, `$1\n        ${preview}\n        $2`);
  fs.writeFileSync(HOME_PAGE_PATH, updatedHtml);
}

function build() {
  const { posts, draftCount } = loadPosts(POSTS_DIR);
  const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'writings-index.html'), 'utf8');
  const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'writings-post.html'), 'utf8');

  cleanWritingsDir();

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const postCards = posts.map(buildPostCard).join('\n');

  const indexHtml = fillTemplate(indexTemplate, {
    META_DESCRIPTION: escapeHtml('Writings on programming, craft, and the cosmic unknown.'),
    CANONICAL_URL: escapeHtml(buildWritingsIndexUrl()),
    TAG_FILTERS: `<button type="button" class="tag writings-tag-filter active" data-tag="">All</button>${buildTagFilters(allTags)}`,
    POST_CARDS: postCards,
  });

  fs.writeFileSync(path.join(WRITINGS_DIR, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(WRITINGS_DIR, 'feed.xml'), buildRssFeed(posts, SITE_URL));
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemapXml(posts, SITE_URL));

  writeWritingsClientScript();
  updateHomePageWritingsPreview(posts);

  for (const post of posts) {
    const related = findRelated(post, posts);
    const categoryHtml = post.category
      ? `<span class="writings-meta-sep">·</span><span class="tag writings-category">${escapeHtml(post.category)}</span>`
      : '';

    const postHtml = fillTemplate(postTemplate, {
      TITLE: escapeHtml(post.title),
      EXCERPT: escapeHtml(post.excerpt),
      CANONICAL_URL: escapeHtml(buildPostUrl(post.slug)),
      DATE_ISO: escapeHtml(post.date),
      DATE_DISPLAY: escapeHtml(post.dateDisplay),
      READING_TIME: escapeHtml(post.readingTime),
      CATEGORY_HTML: categoryHtml,
      TAGS_HTML: buildTagHtml(post.tags),
      CONTENT: post.html,
      RELATED_HTML: buildRelatedHtml(related),
    });

    const postDir = path.join(WRITINGS_DIR, post.slug);
    ensureDir(postDir);
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
  }

  const draftSuffix = draftCount > 0 ? ` (${draftCount} draft(s) skipped)` : '';
  console.log(`Built ${posts.length} post(s) → writings/${draftSuffix}`);
}

try {
  build();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
