import { SelectPost } from "../db/schema";
import MainLayout from "../layouts/MainLayout";
import { marked } from "marked";

const pageAssets = (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js"></script>
    <style>{`
      .EasyMDEContainer, .EasyMDEContainer .CodeMirror { max-width: 100%; }
      .editor-toolbar { flex-wrap: wrap; }
      #post-edit .CodeMirror { height: auto !important; min-height: 200px; width: 100% !important; }
      #post-edit .CodeMirror-scroll { min-height: 200px; }
      #post-edit .CodeMirror-sizer, #post-edit .CodeMirror-lines { width: 100% !important; max-width: 100% !important; }
    `}</style>
  </>
);

export default function PostDetail({
  post,
  isAdmin = false,
  userId = "",
}: {
  post: SelectPost;
  isAdmin?: boolean;
  userId?: string;
}) {
  const isOwner = userId === post.authorId;
  const containerId = `post-content-${post.id}`;
  const renderedContent = marked.parse(post.content ?? "", {
    breaks: true,
  }) as string;
  const safeTitle = JSON.stringify(post.title);
  const safeDescription = JSON.stringify(post.description);
  const safeTags = JSON.stringify(post.tags);
  const safeCoverImage = JSON.stringify(post.coverImage);
  const safeCategory = JSON.stringify(post.category ?? "Products");
  const safeContent = JSON.stringify(post.content);

  const initScript = `(function(){
  var viewEl = document.getElementById('post-view');
  var editEl = document.getElementById('post-edit');
  var editBtn = document.getElementById('btn-edit');
  var cancelBtn = document.getElementById('btn-cancel-edit');
  var easyMDE;

  if(cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      editEl.classList.add('hidden');
      viewEl.classList.remove('hidden');
    });
  }

  var editForm = document.getElementById('edit-post-form');
  if(editForm) {
    editForm.addEventListener('submit', function() {
      if(easyMDE) document.getElementById('edit-content').value = easyMDE.value();
    });
  }

  function makeHeadingDropdown(editor) {
    var existing = document.getElementById('heading-dropdown');
    if(existing) { existing.remove(); return; }
    var btn = document.querySelector('#post-edit .editor-toolbar button[title="Heading"]');
    var dropdown = document.createElement('div');
    dropdown.id = 'heading-dropdown';
    dropdown.style.cssText = 'position:absolute;z-index:9999;background:#fff;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;min-width:80px;';
    [['H1',1],['H2',2],['H3',3]].forEach(function(item) {
      var opt = document.createElement('button');
      opt.type = 'button'; opt.textContent = item[0];
      opt.style.cssText = 'display:block;width:100%;padding:6px 16px;text-align:left;font-size:0.875rem;font-weight:600;background:none;border:none;cursor:pointer;color:#1e293b;';
      opt.onmouseenter = function(){ opt.style.background='#f1f5f9'; };
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
    if(btn) {
      var rect = btn.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
      dropdown.style.left = (rect.left + window.scrollX) + 'px';
    }
    document.body.appendChild(dropdown);
    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if(!dropdown.contains(e.target)) { dropdown.remove(); document.removeEventListener('click', handler); }
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
      if(!file) { document.body.removeChild(input); return; }
      var fd = new FormData(); fd.append('file', file);
      fetch('/api/media/upload', { method: 'POST', body: fd })
        .then(function(r){ return r.json(); })
        .then(function(d){
          var cm = editor.codemirror;
          cm.replaceRange('![' + file.name + '](' + d.url + ')', cm.getCursor());
        })
        .catch(function(){ console.error('Image upload failed'); })
        .finally(function(){ document.body.removeChild(input); });
    });
  }

  if(editBtn) {
    editBtn.addEventListener('click', function() {
      viewEl.classList.add('hidden');
      editEl.classList.remove('hidden');
      if(!easyMDE) {
        easyMDE = new EasyMDE({
          element: document.getElementById('edit-content'),
          toolbar: [
            'bold', 'italic',
            { name: 'heading', action: makeHeadingDropdown, className: 'fa fa-header', title: 'Heading' },
            '|', 'unordered-list', 'ordered-list', '|', 'link',
            { name: 'image-upload', action: makeImageUploadAction, className: 'fa fa-image', title: 'Upload Image' },
            '|', 'preview', 'fullscreen'
          ],
          spellChecker: false,
          initialValue: ${safeContent},
          minHeight: '200px',
          autosave: { enabled: false },
        });
        var cm = easyMDE.codemirror;
        cm.setSize('100%', 'auto');
        cm.on('change', function() { cm.setSize('100%', 'auto'); });
        setTimeout(function() { cm.refresh(); cm.setSize('100%', 'auto'); }, 50);
      } else {
        setTimeout(function() { easyMDE.codemirror.refresh(); easyMDE.codemirror.setSize('100%', 'auto'); }, 50);
      }
      document.getElementById('edit-title').value = ${safeTitle};
      var descEl = document.getElementById('edit-description');
      descEl.value = ${safeDescription};
      descEl.style.height = 'auto'; descEl.style.height = descEl.scrollHeight + 'px';
      document.getElementById('edit-tags').value = ${safeTags};
      document.getElementById('edit-cover-image').value = ${safeCoverImage};
      var catRadio = document.querySelector('input[name="category"][value="' + ${safeCategory} + '"]');
      if(catRadio) catRadio.checked = true;
      var prevImg = document.getElementById('edit-cover-preview-img');
      var prevBox = document.getElementById('edit-cover-preview');
      if(${safeCoverImage}) { prevImg.src = ${safeCoverImage}; prevBox.classList.remove('hidden'); }
      else { prevBox.classList.add('hidden'); }
    });
  }

  var editCoverInput = document.getElementById('edit-cover-file');
  if(editCoverInput) {
    document.getElementById('edit-cover-upload-btn').addEventListener('click', function() { editCoverInput.click(); });
    editCoverInput.addEventListener('change', function() {
      var file = editCoverInput.files && editCoverInput.files[0];
      if(!file) return;
      var fd = new FormData(); fd.append('file', file);
      var btn = document.getElementById('edit-cover-upload-btn');
      btn.textContent = 'Uploading...'; btn.disabled = true;
      fetch('/api/media/upload', { method: 'POST', body: fd })
        .then(function(r){ return r.json(); })
        .then(function(d){
          document.getElementById('edit-cover-image').value = d.url;
          var img = document.getElementById('edit-cover-preview-img');
          var box = document.getElementById('edit-cover-preview');
          img.src = d.url; box.classList.remove('hidden');
        })
        .catch(function(){ alert('Upload failed'); })
        .finally(function(){ btn.textContent = 'Upload image'; btn.disabled = false; });
    });
    document.getElementById('edit-cover-remove').addEventListener('click', function() {
      document.getElementById('edit-cover-image').value = '';
      document.getElementById('edit-cover-preview').classList.add('hidden');
      editCoverInput.value = '';
    });
  }

  window.addEventListener('resize', function() {
    if(easyMDE && editEl && !editEl.classList.contains('hidden')) {
      easyMDE.codemirror.setSize('100%', 'auto');
      easyMDE.codemirror.refresh();
    }
  });
  
  // Post action handlers
  document.querySelectorAll('.post-action-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const action = btn.dataset.action;
      const postId = btn.dataset.postId;
      
      if (action === 'delete' && !confirm('Delete this post?')) return;
      
      try {
        const endpoint = action === 'delete' 
          ? \`/api/admin/posts/\${postId}/delete\`
          : \`/api/admin/posts/\${postId}/\${action}\`;
        
        const res = await fetch(endpoint, { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
          window.showToast(data.message, 'success');
          if (action === 'delete') {
            setTimeout(() => window.location.href = '/posts', 1500);
          } else {
            setTimeout(() => window.location.reload(), 1500);
          }
        } else {
          window.showToast(data.error || 'Action failed', 'error');
        }
      } catch (err) {
        console.error('Error:', err);
        window.showToast('Action failed', 'error');
      }
    });
  });
})();`;

  const tags = post.tags
    ? post.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <MainLayout
      isLoggedIn={!!userId}
      isAdmin={isAdmin}
      extraHeadAssets={pageAssets}
      currentPath={`/posts/${post.id}`}
      breadcrumbLabel={post.title}
    >
      <div class="mt-8 pb-16 flex flex-col lg:flex-row gap-8 items-start">
        {/* ── MAIN CONTENT ── */}
        <div class="flex-1 min-w-0 w-full overflow-x-hidden">
          <a href="/posts" class="text-sm text-slate-500 hover:underline">
            ← Back to posts
          </a>

          {/* VIEW MODE */}
          <div id="post-view" class="mt-4">
            <div class="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <h1 class="text-3xl font-bold text-slate-900">{post.title}</h1>
                {post.status === "draft" && (
                  <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Draft
                  </span>
                )}
                {post.pinned && (
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    Pinned
                  </span>
                )}
              </div>
              {post.description && (
                <p class="text-slate-500 italic mb-4">{post.description}</p>
              )}
              <div
                id={containerId}
                class="font-normal text-slate-700 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-slate-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_img]:max-w-full [&_iframe]:max-w-full"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              ></div>
            </div>
          </div>

          {/* EDIT MODE */}
          {isOwner && (
            <div id="post-edit" class="hidden mt-4">
              <div class="p-6 border border-blue-200 rounded-xl bg-white shadow-sm">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-xl font-bold text-slate-900">Edit Post</h2>
                  <button
                    id="btn-cancel-edit"
                    type="button"
                    class="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
                <form
                  id="edit-post-form"
                  method="post"
                  action={`/api/posts/${post.id}/edit`}
                  hx-boost="false"
                  class="space-y-4"
                >
                  <input
                    type="hidden"
                    id="edit-cover-image"
                    name="cover_image"
                    value=""
                  />
                  <div class="border border-slate-200 rounded-lg overflow-hidden">
                    <div class="px-4 pt-4 pb-3">
                      <p class="text-sm font-medium text-slate-700 mb-3">
                        Cover Image
                      </p>
                      <div class="flex items-center gap-3">
                        <input
                          id="edit-cover-file"
                          type="file"
                          accept="image/*"
                          class="hidden"
                        />
                        <button
                          id="edit-cover-upload-btn"
                          type="button"
                          class="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded transition-colors"
                        >
                          Upload image
                        </button>
                        <span class="text-xs text-slate-400">
                          or keep existing
                        </span>
                      </div>
                    </div>
                    <div id="edit-cover-preview" class="hidden relative">
                      <img
                        id="edit-cover-preview-img"
                        src=""
                        alt="Cover"
                        class="w-full h-auto block"
                      />
                      <button
                        id="edit-cover-remove"
                        type="button"
                        class="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      id="edit-title"
                      name="title"
                      type="text"
                      required
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      rows={2}
                      oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none overflow-hidden"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">
                      Tags
                    </label>
                    <input
                      id="edit-tags"
                      name="tags"
                      type="text"
                      placeholder="e.g. javascript, webdev"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <div class="flex gap-4">
                      {(["Products", "Services", "News"] as const).map(
                        (cat) => (
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={cat}
                              class="accent-slate-900"
                            />
                            <span class="text-sm text-slate-700">{cat}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">
                      Content
                    </label>
                    <textarea id="edit-content" name="content"></textarea>
                  </div>
                  <div class="flex gap-3 pt-2">
                    <button
                      type="submit"
                      class="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
                    >
                      Save changes
                    </button>
                    <button
                      id="btn-cancel-edit-bottom"
                      type="button"
                      onclick="document.getElementById('btn-cancel-edit').click()"
                      class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* COMMENTS SECTION */}
          <div class="mt-8 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h2 class="text-xl font-bold text-slate-900 mb-6">Comments</h2>

            {/* Comment form - only for logged in users */}
            {userId ? (
              <div class="mb-8 pb-8 border-b border-slate-200">
                <div class="mb-3">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    Add a comment
                  </label>
                  <textarea
                    id="comment-textarea"
                    rows={3}
                    placeholder="Share your thoughts..."
                    maxlength={1000}
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                  ></textarea>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-slate-400">
                      Max 1000 characters
                    </span>
                    <button
                      id="comment-submit-btn"
                      type="button"
                      class="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
                    >
                      Post comment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div class="mb-8 pb-8 border-b border-slate-200 text-center">
                <p class="text-sm text-slate-500">
                  <a
                    href="/login"
                    class="text-blue-900 font-medium hover:underline"
                  >
                    Log in
                  </a>{" "}
                  to comment
                </p>
              </div>
            )}

            {/* Comments list */}
            <div id="comments-list" class="space-y-4">
              {/* Comments will be loaded here */}
            </div>
          </div>

          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
  const userId = '${userId}';
  const isAdmin = ${isAdmin};
  
  async function loadComments() {
    try {
      const res = await fetch('/api/comments?postId=${post.id}');
      const comments = await res.json();
      const list = document.getElementById('comments-list');
      
      if (!Array.isArray(comments) || comments.length === 0) {
        list.innerHTML = '<p class="text-center text-slate-400 text-sm">No comments yet. Be the first to comment!</p>';
        return;
      }
      
      list.innerHTML = comments.map(comment => {
        const date = new Date(comment.createdAt);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const isOwner = userId === comment.userId;
        const canDelete = isOwner || isAdmin;
        const canPin = isAdmin;
        
        let actionsHtml = '';
        if (canDelete || canPin) {
          actionsHtml = '<div class="flex flex-col gap-1.5">';
          if (canPin) {
            if (comment.pinned) {
              actionsHtml += '<button class="text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-300 unpin-btn" data-id="' + comment.id + '">↓ Unpin</button>';
            } else {
              actionsHtml += '<button class="text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-300 pin-btn" data-id="' + comment.id + '">↑ Pin</button>';
            }
          }
          if (canDelete) {
            actionsHtml += '<button class="text-xs text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-300 delete-btn" data-id="' + comment.id + '">✕ Delete</button>';
          }
          actionsHtml += '</div>';
        }
        
        const authorId = comment.userId.substring(0, 6);
        return \`
        <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div class="flex items-start justify-between mb-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 text-xs bg-cyan-100 text-cyan-800 font-semibold px-3 py-1 rounded-full">
                  <span class="text-cyan-600">Author:</span>
                  \${authorId}
                </span>
                \${comment.pinned ? '<span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Pinned</span>' : ''}
              </div>
              <div class="text-xs text-slate-400 mt-1">\${dateStr}</div>
            </div>
            \${actionsHtml}
          </div>
          <p class="text-sm text-slate-700 whitespace-pre-wrap">\${comment.content}</p>
        </div>
      \`;
      }).join('');
      
      // Attach event listeners
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this comment?')) return;
          const id = btn.dataset.id;
          try {
            const res = await fetch('/api/comments/' + id, { method: 'DELETE' });
            if (res.ok) {
              loadComments();
            } else {
              alert('Failed to delete comment');
            }
          } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Error deleting comment');
          }
        });
      });
      
      document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          try {
            const res = await fetch('/api/comments/' + id + '/pin', { method: 'POST' });
            if (res.ok) {
              loadComments();
            } else {
              alert('Failed to pin comment');
            }
          } catch (err) {
            console.error('Error pinning comment:', err);
            alert('Error pinning comment');
          }
        });
      });
      
      document.querySelectorAll('.unpin-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          try {
            const res = await fetch('/api/comments/' + id + '/unpin', { method: 'POST' });
            if (res.ok) {
              loadComments();
            } else {
              alert('Failed to unpin comment');
            }
          } catch (err) {
            console.error('Error unpinning comment:', err);
            alert('Error unpinning comment');
          }
        });
      });
    } catch (err) {
      console.error('Failed to load comments:', err);
      document.getElementById('comments-list').innerHTML = '<p class="text-center text-red-400 text-sm">Failed to load comments</p>';
    }
  }
  
  loadComments();
  
  const textarea = document.getElementById('comment-textarea');
  const btn = document.getElementById('comment-submit-btn');
  
  if (btn && textarea) {
    btn.addEventListener('click', async () => {
      const content = textarea.value.trim();
      
      if (!content) {
        alert('Please enter a comment');
        return;
      }
      
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Posting...';
      
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: ${post.id},
            content: content
          })
        });
        
        if (res.ok) {
          textarea.value = '';
          await loadComments();
        } else {
          const err = await res.json();
          alert('Error: ' + (err.error || 'Failed to post comment'));
        }
      } catch (err) {
        console.error('Error posting comment:', err);
        alert('Error posting comment');
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }
})();`,
            }}
          />
        </div>

        {/* ── STICKY SIDEBAR ── */}
        <aside class="w-full lg:w-64 shrink-0 self-start lg:sticky lg:top-20 border border-slate-200 rounded bg-white divide-y divide-slate-200">
          {/* Search */}
          <div class="px-4 py-4">
            <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Search
            </p>
            <div class="flex items-center gap-2 border border-slate-200 rounded px-2.5 py-2 focus-within:ring-1 focus-within:ring-slate-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 text-slate-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search posts..."
                class="flex-1 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none bg-transparent"
                onkeydown="if(event.key==='Enter'){event.preventDefault();window.location.href='/?search='+encodeURIComponent(this.value)}"
              />
            </div>
          </div>

          {/* Categories */}
          <div class="px-4 py-4">
            <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Categories
            </p>
            <div class="space-y-1.5">
              {(["All", "Products", "Services", "News"] as const).map((cat) => (
                <a
                  href={cat === "All" ? "/" : `/?category=${cat}`}
                  class={`flex items-center gap-2 text-sm px-2 py-1 rounded transition-colors ${post.category === cat ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          {(isOwner || isAdmin) && (
            <div class="px-4 py-4">
              <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
                Actions
              </p>
              <div class="flex flex-col gap-2">
                {/* Publish — admin, draft */}
                {isAdmin && post.status === "draft" && (
                  <button
                    type="button"
                    class="w-full text-left text-sm text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 px-3 py-2 rounded-lg font-medium transition-all duration-300 post-action-btn"
                    data-action="publish"
                    data-post-id={post.id}
                  >
                    ✓ Publish post
                  </button>
                )}

                {/* Edit — owner only */}
                {isOwner && (
                  <button
                    id="btn-edit"
                    type="button"
                    class="w-full text-left text-sm text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    ✎ Edit post
                  </button>
                )}

                {/* Pin — admin, published, not pinned */}
                {isAdmin && post.status === "published" && !post.pinned && (
                  <button
                    type="button"
                    class="w-full text-left text-sm text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 px-3 py-2 rounded-lg font-medium transition-all duration-300 post-action-btn"
                    data-action="pin"
                    data-post-id={post.id}
                  >
                    ↑ Pin to homepage
                  </button>
                )}

                {/* Unpin — admin, pinned */}
                {isAdmin && post.pinned && (
                  <button
                    type="button"
                    class="w-full text-left text-sm text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg font-medium transition-all duration-300 post-action-btn"
                    data-action="unpin"
                    data-post-id={post.id}
                  >
                    ↓ Unpin
                  </button>
                )}

                {/* Delete */}
                {isAdmin ? (
                  <button
                    type="button"
                    class="w-full text-left text-sm text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-3 py-2 rounded-lg font-medium transition-all duration-300 post-action-btn"
                    data-action="delete"
                    data-post-id={post.id}
                  >
                    ✕ Delete post
                  </button>
                ) : isOwner ? (
                  <button
                    type="button"
                    class="w-full text-left text-sm text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-3 py-2 rounded-lg font-medium transition-all duration-300 post-action-btn"
                    data-action="delete"
                    data-post-id={post.id}
                  >
                    ✕ Delete post
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div class="px-4 py-4">
              <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
                Tags
              </p>
              <div class="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <a
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    class="text-xs border border-slate-200 text-slate-600 px-2 py-0.5 rounded hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </MainLayout>
  );
}
