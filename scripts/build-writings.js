import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import readingTime from 'reading-time';
import sanitizeHtml from 'sanitize-html';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const WRITINGS_DIR = path.join(ROOT, 'writings');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

const SAFE_TAG_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'ul', 'ol', 'li', 'blockquote',
    'pre', 'code', 'em', 'strong', 'del', 'sup', 'sub',
    'a', 'img', 'hr',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span',
  ],
  allowedAttributes: {
    a: ['href', 'title'],
    img: ['src', 'alt', 'title'],
    code: ['class'],
    pre: ['class'],
    span: ['class'],
    th: ['colspan', 'rowspan', 'align'],
    td: ['colspan', 'rowspan', 'align'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

function validateSlug(slug, filename) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug "${slug}" in ${filename}. Use lowercase letters, numbers, and hyphens only.`);
  }
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw new Error(`Path traversal detected in slug "${slug}" (${filename}).`);
  }
}

function validateDate(dateStr, filename) {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date "${dateStr}" in ${filename}. Use ISO format (YYYY-MM-DD).`);
  }
}

function validateTagValue(value, field, filename) {
  const str = String(value).trim();
  if (!SAFE_TAG_PATTERN.test(str)) {
    throw new Error(
      `Invalid ${field} "${str}" in ${filename}. Allowed: letters, numbers, spaces, hyphens, underscores.`
    );
  }
  return str;
}

function normalizeTags(tags, filename) {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.map((t) => validateTagValue(t, 'tag', filename));
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function autoExcerpt(markdown) {
  const paragraph = markdown
    .replace(/^#.+$/gm, '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .find((p) => p.length > 0 && !p.startsWith('```'));
  if (!paragraph) return '';
  return paragraph.replace(/\n/g, ' ').slice(0, 200);
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${escapeHtml(lang)}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {
        /* fall through */
      }
    }
    return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`;
  },
});

function renderMarkdown(content) {
  const raw = md.render(content);
  const before = raw.length;
  const clean = sanitizeHtml(raw, SANITIZE_OPTIONS);
  if (clean.length < before * 0.5 && raw.includes('<')) {
    console.warn('Warning: sanitizer removed significant content — raw HTML may have been present in Markdown source.');
  }
  return clean;
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    throw new Error(`Posts directory not found: ${POSTS_DIR}`);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    throw new Error('No .md files found in posts/');
  }

  return files.map((filename) => {
    const slug = path.basename(filename, '.md');
    validateSlug(slug, filename);

    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data, content } = matter(raw);

    if (!data.title) {
      throw new Error(`Missing required frontmatter field "title" in ${filename}`);
    }
    if (!data.date) {
      throw new Error(`Missing required frontmatter field "date" in ${filename}`);
    }

    validateDate(data.date, filename);

    const dateIso = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date).slice(0, 10);

    const tags = normalizeTags(data.tags, filename);
    const category = data.category ? validateTagValue(data.category, 'category', filename) : '';
    const title = String(data.title).trim();
    const excerpt = data.excerpt ? String(data.excerpt).trim() : autoExcerpt(content);
    const html = renderMarkdown(content);
    const stats = readingTime(content);

    return {
      slug,
      title,
      date: dateIso,
      dateDisplay: formatDate(dateIso),
      tags,
      category,
      excerpt,
      html,
      readingTime: stats.text,
      readingMinutes: stats.minutes,
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function tagOverlapScore(a, b) {
  const shared = a.tags.filter((t) => b.tags.includes(t));
  return shared.length;
}

function findRelated(post, allPosts, limit = 3) {
  return allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ post: p, score: tagOverlapScore(post, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
    .slice(0, limit)
    .map((r) => r.post);
}

function buildTagHtml(tags) {
  return tags
    .map((t) => `<span class="tag writings-tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`)
    .join('');
}

function buildPostCard(post) {
  const tagsHtml = buildTagHtml(post.tags);
  const categoryHtml = post.category
    ? `<span class="tag writings-category">${escapeHtml(post.category)}</span>`
    : '';

  return `<a href="/writings/${escapeHtml(post.slug)}/" class="writings-card" data-tags="${escapeHtml(post.tags.join(','))}" data-search="${escapeHtml([post.title, post.excerpt, post.tags.join(' '), post.category].join(' ').toLowerCase())}">
    <h3>${escapeHtml(post.title)}</h3>
    <div class="writings-card-meta">
      <time datetime="${escapeHtml(post.date)}">${escapeHtml(post.dateDisplay)}</time>
      <span>·</span>
      <span>${escapeHtml(post.readingTime)}</span>
    </div>
    <p class="writings-card-excerpt">${escapeHtml(post.excerpt)}</p>
    <div class="writings-card-tags">${categoryHtml}${tagsHtml}</div>
  </a>`;
}

function buildTagFilters(allTags) {
  return allTags
    .map((t) => `<button type="button" class="tag writings-tag-filter" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
    .join('');
}

function buildRelatedHtml(related) {
  if (related.length === 0) return '';

  const items = related
    .map(
      (p) => `<li><a href="/writings/${escapeHtml(p.slug)}/">${escapeHtml(p.title)}</a></li>`
    )
    .join('');

  return `<aside class="writings-related">
    <h2>Related Writings</h2>
    <ul>${items}</ul>
  </aside>`;
}

function buildSearchIndex(posts) {
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    category: p.category,
    date: p.date,
  }));
}

function writeWritingsClientScript() {
  const script = `// Client-side search and tag filtering for writings index.
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
`;

  fs.writeFileSync(path.join(WRITINGS_DIR, 'writings.js'), script);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanWritingsDir() {
  if (fs.existsSync(WRITINGS_DIR)) {
    fs.rmSync(WRITINGS_DIR, { recursive: true });
  }
  ensureDir(WRITINGS_DIR);
}

function build() {
  const posts = loadPosts();
  const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'writings-index.html'), 'utf8');
  const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'writings-post.html'), 'utf8');

  cleanWritingsDir();

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const postCards = posts.map(buildPostCard).join('\n');

  const indexHtml = fillTemplate(indexTemplate, {
    META_DESCRIPTION: escapeHtml('Writings on programming, craft, and the cosmic unknown.'),
    TAG_FILTERS: `<button type="button" class="tag writings-tag-filter active" data-tag="">All</button>${buildTagFilters(allTags)}`,
    POST_CARDS: postCards,
  });

  fs.writeFileSync(path.join(WRITINGS_DIR, 'index.html'), indexHtml);

  const searchIndex = buildSearchIndex(posts);
  fs.writeFileSync(
    path.join(WRITINGS_DIR, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );

  writeWritingsClientScript();

  for (const post of posts) {
    const related = findRelated(post, posts);
    const categoryHtml = post.category
      ? `<span class="writings-meta-sep">·</span><span class="tag writings-category">${escapeHtml(post.category)}</span>`
      : '';

    const postHtml = fillTemplate(postTemplate, {
      TITLE: escapeHtml(post.title),
      EXCERPT: escapeHtml(post.excerpt),
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

  console.log(`Built ${posts.length} post(s) → writings/`);
}

build();
