import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  fillTemplate,
  validateSlug,
  validateDate,
  validateTagValue,
  normalizeTags,
  plainTextExcerpt,
  relationScore,
  findRelated,
  buildHomePostCard,
} from './writings-utils.js';

function makePost(overrides) {
  return {
    slug: 'slug',
    title: 'Title',
    tags: [],
    tagSet: new Set(),
    category: '',
    timestamp: 0,
    ...overrides,
  };
}

test('escapeHtml escapes all reserved HTML characters', () => {
  const input = `<a href="x">it's & "quoted"</a>`;
  const expected = '&lt;a href=&quot;x&quot;&gt;it&#39;s &amp; &quot;quoted&quot;&lt;/a&gt;';
  assert.equal(escapeHtml(input), expected);
});

test('fillTemplate substitutes known placeholders', () => {
  assert.equal(fillTemplate('Hello {{NAME}}!', { NAME: 'World' }), 'Hello World!');
});

test('fillTemplate renders missing placeholders as an empty string', () => {
  assert.equal(fillTemplate('Hello {{NAME}}!', {}), 'Hello !');
});

test('validateSlug accepts a well-formed slug', () => {
  assert.doesNotThrow(() => validateSlug('my-post-1', 'my-post-1.md'));
});

test('validateSlug rejects a slug with invalid characters', () => {
  assert.throws(() => validateSlug('My_Post', 'My_Post.md'), /Invalid slug/);
});

test('validateSlug rejects an empty slug', () => {
  assert.throws(() => validateSlug('', 'empty.md'), /Invalid slug/);
});

test('validateDate accepts a valid ISO date string', () => {
  assert.doesNotThrow(() => validateDate('2026-06-29', 'post.md'));
});

test('validateDate rejects an invalid date string', () => {
  assert.throws(() => validateDate('not-a-date', 'post.md'), /Invalid date/);
});

test('validateTagValue accepts a well-formed tag', () => {
  assert.equal(validateTagValue('javascript', 'tag', 'post.md'), 'javascript');
});

test('validateTagValue rejects a tag with disallowed characters', () => {
  assert.throws(() => validateTagValue('java$script', 'tag', 'post.md'), /Invalid tag/);
});

test('validateTagValue rejects an array value', () => {
  assert.throws(() => validateTagValue(['a', 'b'], 'tag', 'post.md'), /expected a string, got an array/);
});

test('normalizeTags returns an empty array for falsy input', () => {
  assert.deepEqual(normalizeTags(undefined, 'post.md'), []);
  assert.deepEqual(normalizeTags('', 'post.md'), []);
});

test('normalizeTags wraps a single string tag in an array', () => {
  assert.deepEqual(normalizeTags('solo', 'post.md'), ['solo']);
});

test('normalizeTags validates every item in an array', () => {
  assert.deepEqual(normalizeTags(['a', 'b-c'], 'post.md'), ['a', 'b-c']);
  assert.throws(() => normalizeTags(['ok', 'bad!'], 'post.md'), /Invalid tag/);
});

test('plainTextExcerpt strips markdown formatting', () => {
  const markdown = 'This is **bold** and `code` and a [link](https://example.com).';
  assert.equal(plainTextExcerpt(markdown, 200), 'This is bold and code and a link.');
});

test('plainTextExcerpt returns short text unchanged without an ellipsis', () => {
  assert.equal(plainTextExcerpt('A short paragraph.', 200), 'A short paragraph.');
});

test('plainTextExcerpt truncates long text at a word boundary with an ellipsis', () => {
  const longText = Array(60).fill('word').join(' ');
  const expected = `${Array(10).fill('word').join(' ')}…`;
  assert.equal(plainTextExcerpt(longText, 50), expected);
});

test('plainTextExcerpt returns an empty string when no paragraph is found', () => {
  assert.equal(plainTextExcerpt('# Just a heading\n\n```\ncode only\n```', 200), '');
});

test('relationScore counts shared tags between two posts', () => {
  const a = makePost({ slug: 'a', tags: ['js', 'perf'], tagSet: new Set(['js', 'perf']) });
  const b = makePost({ slug: 'b', tags: ['js'], tagSet: new Set(['js']) });
  assert.equal(relationScore(a, b), 1);
});

test('relationScore adds a bonus point for a shared non-empty category', () => {
  const a = makePost({ slug: 'a', category: 'algorithms' });
  const b = makePost({ slug: 'b', category: 'algorithms' });
  assert.equal(relationScore(a, b), 1);
});

test('relationScore ignores category match when category is empty', () => {
  const a = makePost({ slug: 'a', category: '' });
  const b = makePost({ slug: 'b', category: '' });
  assert.equal(relationScore(a, b), 0);
});

test('findRelated excludes posts sharing the same slug and posts with zero score', () => {
  const target = makePost({ slug: 'target', tags: ['js'], tagSet: new Set(['js']), timestamp: 3 });
  const sameSlug = makePost({ slug: 'target', tags: ['js'], tagSet: new Set(['js']), timestamp: 3 });
  const related = makePost({ slug: 'related', tags: ['js'], tagSet: new Set(['js']), timestamp: 2 });
  const unrelated = makePost({ slug: 'unrelated', tags: ['rust'], tagSet: new Set(['rust']), timestamp: 1 });

  const results = findRelated(target, [target, sameSlug, related, unrelated], 3);
  assert.deepEqual(results.map((p) => p.slug), ['related']);
});

test('findRelated sorts by score then recency and respects the limit', () => {
  const target = makePost({ slug: 'target', tags: ['js', 'perf'], tagSet: new Set(['js', 'perf']) });
  const strong = makePost({ slug: 'strong', tags: ['js', 'perf'], tagSet: new Set(['js', 'perf']), timestamp: 1 });
  const weakOld = makePost({ slug: 'weak-old', tags: ['js'], tagSet: new Set(['js']), timestamp: 1 });
  const weakNew = makePost({ slug: 'weak-new', tags: ['js'], tagSet: new Set(['js']), timestamp: 2 });

  const results = findRelated(target, [target, strong, weakOld, weakNew], 2);
  assert.deepEqual(results.map((p) => p.slug), ['strong', 'weak-new']);
});

test('buildHomePostCard renders a card with title, meta, excerpt, category, and tags', () => {
  const post = makePost({
    slug: 'my-post',
    title: 'My Post',
    date: '2026-06-29',
    dateDisplay: 'June 29, 2026',
    readingTime: '3 min read',
    excerpt: 'A short excerpt.',
    category: 'algorithms',
    tags: ['js', 'perf'],
  });

  const html = buildHomePostCard(post);

  assert.ok(html.includes('href="/writings/my-post/"'));
  assert.ok(html.includes('<h3>My Post</h3>'));
  assert.ok(html.includes('<time datetime="2026-06-29">June 29, 2026</time>'));
  assert.ok(html.includes('3 min read'));
  assert.ok(html.includes('A short excerpt.'));
  assert.ok(html.includes('<span class="tag writings-category">algorithms</span>'));
  assert.ok(html.includes('<span class="tag">js</span>'));
  assert.ok(html.includes('<span class="tag">perf</span>'));
  assert.ok(!html.includes('data-tag'));
  assert.ok(!html.includes('data-search'));
});

test('buildHomePostCard omits the category tag when a post has no category', () => {
  const post = makePost({ slug: 'no-category', category: '', tags: ['js'] });
  const html = buildHomePostCard(post);
  assert.ok(!html.includes('writings-category'));
});
