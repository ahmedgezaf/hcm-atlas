/* =====================================================================
   PORTABLE MARKDOWN — the renderer the editable edition uses in place of
   the Python build.
   ---------------------------------------------------------------------
   It handles exactly the subset the chapters use, and no more: `##`
   headings, paragraphs, `- ` bullets, `> ` blockquotes, fenced code,
   **bold**, *italic*, `code`, and the [[lab:id]] / [[fig:id]] embeds.
   Then, like build.py, it wraps the "Common mistakes" and "Sources"
   sections and turns the bare URLs in Sources into links.

   scripts/check_portable.js renders every chapter with this and with
   Python-Markdown and fails if any differ, so the two cannot drift. If
   a chapter needs a construct this does not handle — a table, a numbered
   list, a link — add it here and to that check, not just to the chapter.

   Works in the browser and in Node (module.exports at the bottom).
   ===================================================================== */

function mdEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Inline formatting. Code spans are lifted out first, so a `COUNT(*)`
   never has its asterisk read as the start of an emphasis. */
function mdInline(s) {
  const codes = [];
  s = s.replace(/`([^`\n]+)`/g, (_, c) => { codes.push('<code>' + mdEscape(c) + '</code>'); return '\uE000' + (codes.length - 1) + '\uE001'; });
  s = mdEscape(s);
  s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*(?=\S)([^*]*?\S)\*(?![*\w])/g, '$1<em>$2</em>');
  return s.replace(/\uE000(\d+)\uE001/g, (_, n) => codes[+n]);
}

const MD_BLOCK_START = /^(```|## |- |> |<(div|figure) )/;

function mdRender(src) {
  src = src
    .replace(/\[\[lab:([a-z0-9-]+)\]\]/g, '<div class="lab-embed" data-lab="$1"></div>')
    .replace(/\[\[fig:([a-z0-9-]+)\]\]/g, '<figure class="fig-embed" data-fig="$1"></figure>');
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim(), buf = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i += 1; }
      i += 1;
      // Fenced blocks escape double quotes too; ordinary text does not. That is
      // Python-Markdown's behaviour, and the parity check holds us to it.
      out.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${mdEscape(buf.join('\n')).replace(/"/g, '&quot;')}\n</code></pre>`);
    } else if (/^\s*$/.test(line)) {
      i += 1;
    } else if (/^<(div|figure) /.test(line)) {
      out.push(line.trim()); i += 1;
    } else if (/^## /.test(line)) {
      out.push('<h2>' + mdInline(line.slice(3).trim()) + '</h2>'); i += 1;
    } else if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) { items.push('<li>' + mdInline(lines[i].slice(2).trim()) + '</li>'); i += 1; }
      out.push('<ul>\n' + items.join('\n') + '\n</ul>');
    } else if (/^>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i])) { buf.push(lines[i].replace(/^> ?/, '')); i += 1; }
      out.push('<blockquote>\n<p>' + mdInline(buf.join('\n').trim()) + '</p>\n</blockquote>');
    } else {
      const buf = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !MD_BLOCK_START.test(lines[i])) { buf.push(lines[i]); i += 1; }
      out.push('<p>' + mdInline(buf.join('\n').trim()) + '</p>');
    }
  }
  return out.join('\n').split(/(?=<h2>)/).map(chunk => {
    if (chunk.startsWith('<h2>Common mistakes')) return `<div class="mistakes">${chunk}</div>`;
    if (chunk.startsWith('<h2>Sources')) {
      chunk = chunk.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      return `<div class="sources">${chunk}</div>`;
    }
    return chunk;
  }).join('');
}

/* Frontmatter, parsed the way build.py parses it. */
function mdFrontmatter(text) {
  const m = text.replace(/\r\n?/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('missing --- frontmatter block');
  const meta = {};
  m[1].split('\n').forEach(raw => {
    if (!raw.trim() || raw.trim().startsWith('#')) return;
    const at = raw.indexOf(':');
    const key = raw.slice(0, at).trim(), value = raw.slice(at + 1).trim();
    if (key === 'labs' || key === 'terms') meta[key] = value.split(',').map(v => v.trim()).filter(Boolean);
    else if (key === 'num' || key === 'hue' || key === 'minutes') meta[key] = parseInt(value, 10);
    else meta[key] = value;
  });
  meta.labs = meta.labs || [];
  meta.terms = meta.terms || [];
  return { meta, body: m[2].trim() };
}

if (typeof module !== 'undefined') module.exports = { mdRender, mdFrontmatter, mdInline, mdEscape };
