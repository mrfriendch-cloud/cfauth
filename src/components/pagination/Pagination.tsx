/**
 * Pagination Component
 *
 * Displays pagination controls with previous/next buttons and page numbers.
 * Preserves filter state (search, category, tag, author) in navigation.
 *
 * @param currentPage - Current active page number
 * @param totalPages - Total number of pages
 * @param baseUrl - Base URL for pagination links
 * @param searchValue - Current search value
 * @param categoryValue - Current category filter
 * @param tagValue - Current tag filter
 * @param authorValue - Current author filter
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  searchValue?: string;
  categoryValue?: string;
  tagValue?: string;
  authorValue?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = "/",
  searchValue = "",
  categoryValue = "All",
  tagValue = "",
  authorValue = "",
}: PaginationProps) {
  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  /**
   * Build URL with query parameters
   */
  const buildUrl = (page: number): string => {
    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    if (categoryValue && categoryValue !== "All")
      params.set("category", categoryValue);
    if (tagValue) params.set("tag", tagValue);
    if (authorValue) params.set("author", authorValue);
    params.set("page", page.toString());

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <div class="pb-16 flex items-center justify-center gap-2">
      {/* Previous Button */}
      {hasPrevPage && (
        <a
          href={buildUrl(currentPage - 1)}
          class="px-4 py-2 border border-slate-200 rounded hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors duration-300"
        >
          Previous
        </a>
      )}

      {/* Page Numbers */}
      <div class="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <a
            href={buildUrl(page)}
            class={`px-3 py-2 rounded text-sm font-medium transition-all duration-300 ${
              page === currentPage
                ? "bg-slate-900 text-white"
                : "border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {page}
          </a>
        ))}
      </div>

      {/* Next Button */}
      {hasNextPage && (
        <a
          href={buildUrl(currentPage + 1)}
          class="px-4 py-2 border border-slate-200 rounded hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors duration-300"
        >
          Next
        </a>
      )}
    </div>
  );
}
