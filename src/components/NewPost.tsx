import Button from "./Button";

const editorScript = `
(function() {
  // --- EasyMDE ---
  function makeHeadingDropdown(editor) {
    var existing = document.getElementById('heading-dropdown');
    if (existing) { existing.remove(); return; }
    var btn = document.querySelector('.editor-toolbar button[title="Heading"]');
    var dropdown = document.createElement('div');
    dropdown.id = 'heading-dropdown';
    dropdown.style.cssText = 'position:absolute;z-index:9999;background:#fff;border:1px solid #e2e8f0;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.08);overflow:hidden;min-width:72px;';
    [['H1',1],['H2',2],['H3',3]].forEach(function(item) {
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.textContent = item[0];
      opt.style.cssText = 'display:block;width:100%;padding:6px 14px;text-align:left;font-size:0.8rem;font-weight:600;background:none;border:none;cursor:pointer;color:#0f172a;letter-spacing:.04em;';
      opt.onmouseenter = function(){ opt.style.background='#f8fafc'; };
      opt.onmouseleave = function(){ opt.style.background='none'; };
      opt.addEventListener('click', function() {
        var cm = editor.codemirror;
        var cursor = cm.getCursor();
        var line = cm.getLine(cursor.line);
        var hashes = '#'.repeat(item[1]) + ' ';
        var clean = line.replace(/^#+\\s*/, '');
        cm.replaceRange(hashes + clean, {line: cursor.line, ch: 0}, {line: cursor.line, ch: line.length});
        cm.focus(); dropdown.remove();
      });
      dropdown.appendChild(opt);
    });
    if (btn) {
      var rect = btn.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
      dropdown.style.left = (rect.left + window.scrollX) + 'px';
    }
    document.body.appendChild(dropdown);
    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!dropdown.contains(e.target)) { dropdown.remove(); document.removeEventListener('click', handler); }
      });
    }, 0);
  }

  function makeImageUploadAction(editor) {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none';
    document.body.appendChild(input);
    input.click();
    input.addEventListener('change', function() {
      var file = input.files && input.files[0];
      if (!file) { document.body.removeChild(input); return; }
      var formData = new FormData();
      formData.append('file', file);
      fetch('/api/media/upload', { method: 'POST', body: formData })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          var cm = editor.codemirror;
          cm.replaceRange('![' + file.name + '](' + data.url + ')', cm.getCursor());
        })
        .catch(function(err) { console.error('Image upload failed', err); })
        .finally(function() { document.body.removeChild(input); });
    });
  }

  var easyMDE = new EasyMDE({
    element: document.getElementById('content-editor'),
    toolbar: [
      'bold', 'italic',
      { name: 'heading', action: makeHeadingDropdown, className: 'fa fa-header', title: 'Heading' },
      '|', 'unordered-list', 'ordered-list', '|', 'link',
      { name: 'image-upload', action: makeImageUploadAction, className: 'fa fa-image', title: 'Upload Image' },
      '|',
      { name: 'video-embed', action: function(editor) { promptVideoEmbed(editor); }, className: 'fa fa-film', title: 'Embed Video' },
      '|', 'preview', 'fullscreen',
    ],
    spellChecker: false,
  });

  function parseVideoUrl(url) {
    try {
      var parsed = new URL(url);
      var hostname = parsed.hostname.replace(/^www\\./, '');
      if (hostname === 'youtube.com' && parsed.pathname === '/watch') {
        var id = parsed.searchParams.get('v');
        if (id) return 'https://www.youtube.com/embed/' + id;
      }
      if (hostname === 'youtu.be') {
        var id = parsed.pathname.slice(1);
        if (id) return 'https://www.youtube.com/embed/' + id;
      }
      if (hostname === 'vimeo.com') {
        var id = parsed.pathname.slice(1);
        if (id && /^\\d+$/.test(id)) return 'https://player.vimeo.com/video/' + id;
      }
    } catch (e) {}
    return null;
  }

  function promptVideoEmbed(editor) {
    var existingError = document.getElementById('video-embed-error');
    if (existingError) existingError.remove();
    var url = window.prompt('Enter YouTube or Vimeo URL:');
    if (!url) return;
    var embedUrl = parseVideoUrl(url);
    if (!embedUrl) {
      var errorDiv = document.createElement('div');
      errorDiv.id = 'video-embed-error';
      errorDiv.style.cssText = 'color:#dc2626;font-size:0.8rem;margin-top:4px;padding:4px 8px;background:#fef2f2;border:1px solid #fca5a5;border-radius:4px;';
      errorDiv.textContent = 'Unsupported URL. Use a YouTube or Vimeo link.';
      var toolbar = document.querySelector('.EasyMDEContainer .editor-toolbar');
      if (toolbar) toolbar.insertAdjacentElement('afterend', errorDiv);
      setTimeout(function() { if (errorDiv.parentNode) errorDiv.remove(); }, 5000);
      return;
    }
    var iframe = '<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>';
    var cm = editor.codemirror;
    cm.replaceRange(iframe, cm.getCursor());
  }

  // Sync EasyMDE on submit
  var form = document.getElementById('new-post-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      var val = easyMDE.value();
      if (!val || !val.trim()) {
        e.preventDefault();
        easyMDE.codemirror.getWrapperElement().style.border = '1.5px solid #ef4444';
        return;
      }
      easyMDE.codemirror.getWrapperElement().style.border = '';
      document.getElementById('content-editor').value = val;
    });
  }

  // Cover image — upload
  var coverInput = document.getElementById('cover-image-input');
  var coverPreview = document.getElementById('cover-preview');
  var coverPreviewImg = document.getElementById('cover-preview-img');
  var coverUrlInput = document.getElementById('cover_image');

  function showCoverPreview(url) {
    if (!url) { coverPreview.classList.add('hidden'); return; }
    coverPreviewImg.src = url;
    coverPreview.classList.remove('hidden');
  }

  document.getElementById('cover-upload-btn').addEventListener('click', function() { coverInput.click(); });

  coverInput.addEventListener('change', function() {
    var file = coverInput.files && coverInput.files[0];
    if (!file) return;
    var fd = new FormData(); fd.append('file', file);
    var btn = document.getElementById('cover-upload-btn');
    btn.textContent = 'Uploading...'; btn.disabled = true;
    fetch('/api/media/upload', { method: 'POST', body: fd })
      .then(function(r) { return r.json(); })
      .then(function(d) { coverUrlInput.value = d.url; showCoverPreview(d.url); })
      .catch(function() { alert('Upload failed.'); })
      .finally(function() { btn.textContent = 'Upload file'; btn.disabled = false; });
  });

  document.getElementById('cover-url-apply').addEventListener('click', function() {
    var url = document.getElementById('cover-url-field').value.trim();
    coverUrlInput.value = url; showCoverPreview(url);
  });

  document.getElementById('cover-url-field').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('cover-url-apply').click(); }
  });

  document.getElementById('cover-remove').addEventListener('click', function() {
    coverUrlInput.value = ''; showCoverPreview('');
    coverInput.value = ''; document.getElementById('cover-url-field').value = '';
  });

  // Tag pills — click to append to tags input
  document.querySelectorAll('[data-tag-pill]').forEach(function(pill) {
    pill.addEventListener('click', function() {
      var tag = pill.getAttribute('data-tag-pill');
      var tagsInput = document.getElementById('tags-input');
      var current = tagsInput.value.split(',').map(function(t){ return t.trim(); }).filter(Boolean);
      if (!current.includes(tag)) {
        current.push(tag);
        tagsInput.value = current.join(', ');
      }
      pill.classList.toggle('bg-slate-900', !pill.classList.contains('bg-slate-900'));
      pill.classList.toggle('text-white', !pill.classList.contains('text-white'));
    });
  });
})();
`;

export default function NewPost({
  existingTags = [],
}: {
  existingTags?: string[];
}) {
  return (
    <form id="new-post-form" method="post" action="/api/posts">
      <input type="hidden" id="cover_image" name="cover_image" value="" />

      {/* ── Header bar ── */}
      <div class="mb-6 pb-4 border-b border-slate-200">
        <h1 class="text-xl font-bold text-slate-900">New Post</h1>
      </div>

      {/* ── Two-column layout ── */}
      <div class="flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-start">
        {/* ── Main editor column ── */}
        <div class="flex-1 min-w-0 space-y-5 w-full">
          {/* Title */}
          <div>
            <label
              for="title"
              class="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Post title..."
              class="w-full text-base font-medium border border-slate-200 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 placeholder:text-slate-300"
            />
          </div>

          {/* Short Description */}
          <div>
            <label
              for="description"
              class="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2"
            >
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="A brief summary..."
              rows={2}
              oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
              class="w-full text-sm border border-slate-200 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none overflow-hidden text-slate-700 placeholder:text-slate-300"
            ></textarea>
          </div>

          {/* Content */}
          <div>
            <label
              for="content-editor"
              class="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2"
            >
              Content
            </label>
            <textarea id="content-editor" name="content"></textarea>
          </div>

          {/* Publish */}
          <div class="pt-2">
            <button
              type="submit"
              class="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside class="w-full md:w-64 shrink-0 border border-slate-200 rounded divide-y divide-slate-200 bg-white">
          {/* Categories */}
          <div class="px-4 py-4">
            <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Categories
            </p>
            <div class="space-y-1.5">
              {(["Products", "Services", "News"] as const).map((cat) => (
                <label class="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={cat === "Products"}
                    class="accent-slate-900"
                  />
                  <span class="text-sm text-slate-700 group-hover:text-slate-900">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div class="px-4 py-4">
            <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Featured Image
            </p>

            {/* Preview */}
            <div id="cover-preview" class="hidden relative mb-3">
              <img
                id="cover-preview-img"
                src=""
                alt="Cover"
                class="w-full h-auto rounded border border-slate-200"
              />
              <button
                id="cover-remove"
                type="button"
                class="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white text-xs px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            {/* Drop zone */}
            <div
              id="cover-dropzone"
              class="border border-dashed border-slate-300 rounded bg-slate-50 flex flex-col items-center justify-center gap-2 py-6 px-3 text-center"
            >
              <input
                id="cover-image-input"
                type="file"
                accept="image/*"
                class="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16 10l-4-4m0 0L8 10m4-4v12"
                />
              </svg>
              <button
                id="cover-upload-btn"
                type="button"
                class="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                Upload file
              </button>
              <p class="text-xs text-slate-400">or paste a URL below</p>
            </div>

            {/* URL input */}
            <div class="flex gap-1.5 mt-2">
              <input
                id="cover-url-field"
                type="url"
                placeholder="https://..."
                class="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 placeholder:text-slate-300"
              />
              <button
                id="cover-url-apply"
                type="button"
                class="text-xs bg-slate-900 hover:bg-slate-700 text-white font-medium px-2.5 py-1.5 rounded transition-colors"
              >
                Set
              </button>
            </div>
          </div>

          {/* Tags — hidden on mobile */}
          <div class="hidden md:block px-4 py-4">
            <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Tags
            </p>
            <input
              id="tags-input"
              name="tags"
              type="text"
              placeholder="tag1, tag2, ..."
              class="w-full text-xs border border-slate-200 rounded px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 placeholder:text-slate-300 mb-3"
            />
            {existingTags.length > 0 && (
              <div class="flex flex-wrap gap-1.5">
                {existingTags.map((tag) => (
                  <button
                    type="button"
                    data-tag-pill={tag}
                    class="text-xs border border-slate-200 text-slate-600 px-2 py-0.5 rounded hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            {existingTags.length === 0 && (
              <p class="text-xs text-slate-300 italic">No existing tags yet.</p>
            )}
          </div>
        </aside>
      </div>

      <script dangerouslySetInnerHTML={{ __html: editorScript }} />
    </form>
  );
}
