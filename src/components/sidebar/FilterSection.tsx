/**
 * FilterSection Component
 *
 * Displays category filter buttons with active state.
 * Integrates with HTMX for dynamic filtering.
 *
 * @param categories - Array of category options
 * @param activeCategory - Currently selected category
 * @param hxGet - HTMX endpoint URL
 * @param searchValue - Current search value
 * @param tagValue - Current tag value
 * @param authorValue - Current author value
 */

interface FilterSectionProps {
  categories: readonly string[];
  activeCategory: string;
  hxGet: string;
  searchValue?: string;
  tagValue?: string;
  authorValue?: string;
}

export default function FilterSection({
  categories,
  activeCategory,
  hxGet,
  searchValue = "",
  tagValue = "",
  authorValue = "",
}: FilterSectionProps) {
  return (
    <div class="px-5 py-5">
      <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
        Filter
      </p>
      <div class="space-y-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              type="button"
              hx-get={hxGet}
              hx-vals={`{"category": "${category}", "search": "${searchValue}", "tag": "", "author": "", "page": "1"}`}
              hx-target="#home-post-cards"
              hx-swap="outerHTML"
              class={`flex items-center gap-2.5 cursor-pointer w-full px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={isActive}
                class="accent-cyan-600"
                disabled
              />
              <span class="text-sm">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
