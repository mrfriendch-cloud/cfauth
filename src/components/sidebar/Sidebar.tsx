/**
 * Sidebar Component
 *
 * A sticky sidebar containing search, filters, and tags.
 * Responsive design with full width on mobile, fixed width on desktop.
 *
 * @param searchValue - Current search input value
 * @param activeCategory - Currently selected category
 * @param activeTag - Currently selected tag
 * @param activeAuthor - Currently selected author
 * @param allTags - Array of all available tags
 * @param categories - Array of category options
 * @param hxGet - HTMX endpoint URL for filtering
 * @param currentPage - Current pagination page
 */

import SearchInput from "../ui/SearchInput";
import FilterSection from "./FilterSection";
import TagsSection from "./TagsSection";

interface SidebarProps {
  searchValue?: string;
  activeCategory?: string;
  activeTag?: string;
  activeAuthor?: string;
  allTags: string[];
  categories: readonly string[];
  hxGet: string;
  currentPage?: number;
}

export default function Sidebar({
  searchValue = "",
  activeCategory = "All",
  activeTag = "",
  activeAuthor = "",
  allTags,
  categories,
  hxGet,
  currentPage = 1,
}: SidebarProps) {
  return (
    <aside class="w-full md:w-64 shrink-0 md:sticky md:top-20 border border-slate-200 rounded-xl divide-y divide-slate-200 bg-white">
      {/* Search Section */}
      <div class="px-5 py-5">
        <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
          Search
        </p>
        <form method="get" action="/">
          <SearchInput
            placeholder="Search posts..."
            value={searchValue}
            name="search"
            hxGet={hxGet}
            hxTarget="#home-post-cards"
            hxInclude="[name='search'],[name='category'],[name='tag'],[name='author'],[name='page']"
          />
          <input type="hidden" name="category" value={activeCategory} />
          <input type="hidden" name="tag" value={activeTag} />
          <input type="hidden" name="author" value={activeAuthor} />
          <input type="hidden" name="page" value={currentPage} />
        </form>
      </div>

      {/* Filter Section */}
      <FilterSection
        categories={categories}
        activeCategory={activeCategory}
        hxGet={hxGet}
        searchValue={searchValue}
        tagValue={activeTag}
        authorValue={activeAuthor}
      />

      {/* Tags Section */}
      <TagsSection
        tags={allTags}
        activeTag={activeTag}
        hxGet={hxGet}
        searchValue={searchValue}
        categoryValue={activeCategory}
        authorValue={activeAuthor}
      />
    </aside>
  );
}
