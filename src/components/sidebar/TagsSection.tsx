/**
 * TagsSection Component
 *
 * Displays clickable tag buttons for filtering posts.
 * Highlights active tag and integrates with HTMX.
 *
 * @param tags - Array of available tags
 * @param activeTag - Currently selected tag
 * @param hxGet - HTMX endpoint URL
 * @param searchValue - Current search value
 * @param categoryValue - Current category value
 * @param authorValue - Current author value
 */

interface TagsSectionProps {
  tags: string[];
  activeTag: string;
  hxGet: string;
  searchValue?: string;
  categoryValue?: string;
  authorValue?: string;
}

export default function TagsSection({
  tags,
  activeTag,
  hxGet,
  searchValue = "",
  categoryValue = "All",
  authorValue = "",
}: TagsSectionProps) {
  // Don't render if no tags available
  if (tags.length === 0) {
    return null;
  }

  return (
    <div class="px-5 py-5">
      <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
        Tags
      </p>
      <div class="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = tag === activeTag;

          return (
            <button
              type="button"
              hx-get={hxGet}
              hx-vals={`{"tag": "${isActive ? "" : tag}", "search": "${searchValue}", "category": "${categoryValue}", "author": "", "page": "1"}`}
              hx-target="#home-post-cards"
              hx-swap="outerHTML"
              class={`text-xs border px-2.5 py-1 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                  : "border-slate-200 text-slate-600 hover:border-cyan-200 hover:text-cyan-700 hover:bg-cyan-50"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
