/**
 * Services Page (Refactored)
 *
 * Displays service-related posts in a vertical list with horizontal cards.
 * Supports search, tag filtering, and pagination.
 */

import { SelectPost } from "../db/schema";
import MainLayout from "../layouts/MainLayout";
import PostListVertical from "../components/post/PostListVertical";
import Sidebar from "../components/sidebar/Sidebar";
import Pagination from "../components/pagination/Pagination";

// ── Post Cards Component (for HTMX partial rendering) ────────────────────────
export function ServicePostCards({ posts }: { posts: SelectPost[] }) {
  return (
    <PostListVertical
      posts={posts}
      id="service-post-cards"
      baseUrl="/services"
      emptyMessage="No service posts found."
    />
  );
}

// ── Services Page Props Interface ────────────────────────────────────────────
interface ServicesProps {
  posts: SelectPost[];
  allTags: string[];
  activeSearch?: string;
  activeTag?: string;
  currentPage?: number;
  totalCount?: number;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

// ── Services Page Component ──────────────────────────────────────────────────
export default function Services({
  posts,
  allTags,
  activeSearch = "",
  activeTag = "",
  currentPage = 1,
  totalCount = 0,
  isLoggedIn = false,
  isAdmin = false,
}: ServicesProps) {
  // Calculate pagination
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      currentPath="/services"
    >
      {/* Page Header */}
      <section class="py-10 md:py-14 border-b border-slate-200 mb-8">
        <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
          Services
        </p>
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
          Global Distributors
        </h1>
        <p class="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
          Access our high-precision network of authorized industrial partners.
          Each center is equipped with InkSpec calibrated diagnostic tools and
          UV-certified technical teams.
        </p>
      </section>

      {/* Main Content: Posts + Sidebar */}
      <div class="pb-16 flex flex-col lg:flex-row gap-8 items-start">
        {/* Posts List */}
        <div class="flex-1 min-w-0">
          <ServicePostCards posts={posts} />
        </div>

        {/* Sidebar - Services doesn't have categories, only search and tags */}
        <aside class="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 border border-slate-200 rounded-xl divide-y divide-slate-200 bg-white">
          {/* Search Section */}
          <div class="px-5 py-5">
            <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
              Search
            </p>
            <form method="get" action="/services">
              <div class="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 bg-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-slate-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  name="search"
                  type="text"
                  placeholder="Search services..."
                  value={activeSearch}
                  hx-get="/api/services/posts"
                  hx-trigger="input changed delay:300ms"
                  hx-target="#service-post-cards"
                  hx-swap="outerHTML"
                  hx-include="[name='search'],[name='tag'],[name='page']"
                  class="flex-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                <input type="hidden" name="tag" value={activeTag} />
                <input type="hidden" name="page" value={currentPage} />
              </div>
            </form>
          </div>

          {/* Tags Section */}
          {allTags.length > 0 && (
            <div class="px-5 py-5">
              <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
                Tags
              </p>
              <div class="flex flex-wrap gap-1.5">
                {allTags.map((tag) => {
                  const isActive = tag === activeTag;
                  return (
                    <button
                      type="button"
                      hx-get="/api/services/posts"
                      hx-vals={`{"tag": "${isActive ? "" : tag}", "search": "${activeSearch}", "page": "1"}`}
                      hx-target="#service-post-cards"
                      hx-swap="outerHTML"
                      class={`text-xs border px-2.5 py-1 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-slate-900 text-white border-slate-900"
                          : "border-slate-200 text-slate-600 hover:border-cyan-200 hover:text-cyan-700 hover:bg-cyan-50"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/services"
        searchValue={activeSearch}
        tagValue={activeTag}
      />
    </MainLayout>
  );
}
