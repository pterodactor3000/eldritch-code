import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import readingTime from 'reading-time';
import sanitizeHtml from 'sanitize-html';

export const SITE_URL = 'https://eldritchcode.it';

const SAFE_TAG_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'ul', 'ol', 'li', 'blockquote',
    'pre', 'code', 'em', 'strong', 'del', 'sup', 'sub',
    'a', 'img', 'hr',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div',
  ],
  allowedAttributes: {
    a: ['href', 'title'],
    img: ['src', 'alt', 'title'],
    code: ['class'],
    pre: ['class'],
    span: ['class'],
    div: ['class'],
    th: ['colspan', 'rowspan', 'align'],
    td: ['colspan', 'rowspan', 'align'],
  },
  allowedClasses: {
    div: ['mermaid'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
};

const PLAIN_TEXT_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
};

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

export function buildPostUrl(slug) {
  return `${SITE_URL}/writings/${slug}/`;
}

export function buildWritingsIndexUrl() {
  return `${SITE_URL}/writings/`;
}

export function validateSlug(slug, filename) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug "${slug}" in ${filename}. Use lowercase letters, numbers, and hyphens only.`);
  }
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw new Error(`Path traversal detected in slug "${slug}" (${filename}).`);
  }
}

export function validateDate(dateStr, filename) {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date "${dateStr}" in ${filename}. Use ISO format (YYYY-MM-DD).`);
  }
}

function assertScalarField(value, field, filename) {
  if (Array.isArray(value)) {
    throw new Error(`Invalid ${field} in ${filename}: expected a string, got an array.`);
  }
  if (value !== null && typeof value === 'object') {
    throw new Error(`Invalid ${field} in ${filename}: expected a string, got an object.`);
  }
}

export function validateTagValue(value, field, filename) {
  assertScalarField(value, field, filename);
  const str = String(value).trim();
  if (!SAFE_TAG_PATTERN.test(str)) {
    throw new Error(
      `Invalid ${field} "${str}" in ${filename}. Allowed: letters, numbers, spaces, hyphens, underscores.`
    );
  }
  return str;
}

export function normalizeTags(tags, filename) {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.map((t) => validateTagValue(t, 'tag', filename));
}

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

// Custom fence renderer: emit mermaid blocks as bare divs, bypassing the
// pre/code wrapper markdown-it would otherwise add.
const defaultFenceRenderer = md.renderer.rules.fence;
md.renderer.rules.fence = function renderFence(tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const lang = (token.info || '').trim().split(/\s+/g)[0];
  if (lang === 'mermaid') {
    return `<div class="mermaid">${escapeHtml(token.content)}</div>\n`;
  }
  if (defaultFenceRenderer) {
    return defaultFenceRenderer(tokens, idx, options, env, renderer);
  }
  return renderer.renderToken(tokens, idx, options);
};

export function renderMarkdown(content) {
  const raw = md.render(content);
  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}

function firstParagraph(markdown) {
  return markdown
    .replace(/^#.+$/gm, '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .find((p) => p.length > 0 && !p.startsWith('```'));
}

export function plainTextExcerpt(markdown, maxLength = 200) {
  const paragraph = firstParagraph(markdown);
  if (!paragraph) return '';

  const singleLine = paragraph.replace(/\n/g, ' ');
  const inlineHtml = md.renderInline(singleLine);
  const plain = sanitizeHtml(inlineHtml, PLAIN_TEXT_OPTIONS).replace(/\s+/g, ' ').trim();

  if (plain.length <= maxLength) return plain;

  const truncated = plain.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const boundary = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${boundary.trim()}…`;
}

function warnOnMissingImageAlt(html, slug) {
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  for (const imgTag of imgTags) {
    const altMatch = imgTag.match(/alt\s*=\s*"([^"]*)"/i);
    const altText = altMatch ? altMatch[1].trim() : '';
    if (!altText) {
      console.warn(`Warning: image missing alt text in post "${slug}".`);
    }
  }
}

export function loadPosts(postsDir) {
  if (!fs.existsSync(postsDir)) {
    throw new Error(`Posts directory not found: ${postsDir}`);
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    throw new Error(`No .md files found in ${postsDir}`);
  }

  const posts = [];
  let draftCount = 0;

  for (const filename of files) {
    const slug = path.basename(filename, '.md');
    validateSlug(slug, filename);

    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true) {
      draftCount++;
      continue;
    }

    if (!data.title) {
      throw new Error(`Missing required frontmatter field "title" in ${filename}`);
    }
    assertScalarField(data.title, 'title', filename);

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
    const excerpt = data.excerpt ? String(data.excerpt).trim() : plainTextExcerpt(content);
    const html = renderMarkdown(content);
    warnOnMissingImageAlt(html, slug);
    const stats = readingTime(content);

    posts.push({
      slug,
      title,
      date: dateIso,
      dateDisplay: formatDate(dateIso),
      timestamp: new Date(dateIso).getTime(),
      tags,
      tagSet: new Set(tags),
      category,
      excerpt,
      html,
      readingTime: stats.text,
      readingMinutes: stats.minutes,
    });
  }

  if (posts.length === 0) {
    throw new Error(`No published posts found in ${postsDir} (all ${draftCount} post(s) marked draft).`);
  }

  posts.sort((a, b) => b.timestamp - a.timestamp);
  return { posts, draftCount };
}

export function relationScore(a, b) {
  let shared = 0;
  for (const tag of a.tags) {
    if (b.tagSet.has(tag)) shared++;
  }
  const categoryBonus = a.category && a.category === b.category ? 1 : 0;
  return shared + categoryBonus;
}

export function findRelated(post, allPosts, limit = 3) {
  return allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ post: p, score: relationScore(post, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.timestamp - a.post.timestamp)
    .slice(0, limit)
    .map((r) => r.post);
}

export function buildTagHtml(tags) {
  return tags
    .map((t) => `<span class="tag writings-tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`)
    .join('');
}

export function buildPostCard(post) {
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

export function buildHomePostCard(post) {
  const tagsHtml = post.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('\n            ');
  const categoryHtml = post.category
    ? `<span class="tag writings-category">${escapeHtml(post.category)}</span>\n            `
    : '';

  return `<a href="/writings/${escapeHtml(post.slug)}/" class="writings-card">
          <h3>${escapeHtml(post.title)}</h3>
          <div class="writings-card-meta">
            <time datetime="${escapeHtml(post.date)}">${escapeHtml(post.dateDisplay)}</time>
            <span>·</span>
            <span>${escapeHtml(post.readingTime)}</span>
          </div>
          <p class="writings-card-excerpt">
            ${escapeHtml(post.excerpt)}
          </p>
          <div class="writings-card-tags">
            ${categoryHtml}${tagsHtml}
          </div>
        </a>`;
}

export function buildTagFilters(allTags) {
  return allTags
    .map((t) => `<button type="button" class="tag writings-tag-filter" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
    .join('');
}

export function buildRelatedHtml(related) {
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

export function buildSitemapXml(posts, siteUrl = SITE_URL) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${siteUrl}/`, lastmod: today },
    { loc: `${siteUrl}/writings/`, lastmod: today },
    ...posts.map((p) => ({ loc: `${siteUrl}/writings/${p.slug}/`, lastmod: p.date })),
  ];

  const urlEntries = urls
    .map((u) => `  <url>\n    <loc>${escapeHtml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

export function buildRssFeed(posts, siteUrl = SITE_URL) {
  const items = posts
    .map((p) => {
      const link = `${siteUrl}/writings/${p.slug}/`;
      const pubDate = new Date(p.timestamp).toUTCString();
      return `  <item>\n    <title>${escapeHtml(p.title)}</title>\n    <link>${escapeHtml(link)}</link>\n    <guid>${escapeHtml(link)}</guid>\n    <pubDate>${pubDate}</pubDate>\n    <description>${escapeHtml(p.excerpt)}</description>\n  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Eldritch Code - Forbidden Scrolls</title>\n  <link>${siteUrl}/writings/</link>\n  <description>Writings on programming, craft, and the cosmic unknown.</description>\n${items}\n</channel>\n</rss>\n`;
}
