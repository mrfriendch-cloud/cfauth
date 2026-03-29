/**
 * PostsList Page (Refactored)
 *
 * Displays user's own posts (both published and drafts) in a grid layout.
 * Supports search, category filtering, tag filtering, and pagination.
 */

import { SelectPost } from "../db/schema";
import MainLayout from "../layouts/MainLayout";
import PostGrid from "../components/post/PostGrid";
import Sidebar from "../components/sidebar/Sidebar";
import Pagination from "../components/pagination/Pagination";

// ── Post Cards Component (for HTMX partial rendering) ────────────────────────
export function PostListCards({ posts }: { posts: SelectPost[] }) {
  return (
    <PostGrid
      posts={posts}
      id="posts-list-cards"
      baseUrl="/posts"
      showStatus
      emptyMessage="No posts found."
    />
  );
}

// ── PostsList Page Props Interface ───────────────────────────────────────────
interface PostsListProps {
  posts: SelectPost[];
  allTags: string[];
  activeSearch?: string;
  activeCategory?: string;
  activeTag?: string;
  currentPage?: number;
  totalCount?: number;
  isAdmin?: boolean;
}

// ── PostsList Page Component ─────────────────────────────────────────────────
export default function PostsList({
  posts,
  allTags,
  activeSearch = "",
  activeCategory = "",
  activeTag = "",
  currentPage = 1,
  totalCount = 0,
  isAdmin = false,
}: PostsListProps) {
  // Calculate pagination
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Category options (empty string = "All")
  const CATEGORIES = ["", "Products", "Services", "News"] as const;

  return (
    <MainLayout isLoggedIn={true} isAdmin={isAdmin} currentPath="/posts">
      {/* Page Header */}
      <section class="py-10 md:py-14 border-b border-slate-200 mb-8">
        <p class="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">
          My Posts
        </p>
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
          Your Published & Draft Posts
        </h1>
        <p class="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
          Manage all your posts in one place. Filter by category, search by
          title, or browse by tags.
        </p>
      </section>

      {/* Main Content: Sidebar + Posts */}
      <section class="pb-16 flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar with Filters */}
        <Sidebar
          searchValue={activeSearch}
          activeCategory={activeCategory}
          activeTag={activeTag}
          allTags={allTags}
          categories={CATEGORIES}
          hxGet="/api/posts/list"
          currentPage={currentPage}
        />

        {/* Post Grid */}
        <div class="flex-1 min-w-0">
          <PostListCards posts={posts} />
        </div>
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/posts"
        searchValue={activeSearch}
        categoryValue={activeCategory}
        tagValue={activeTag}
      />
    </MainLayout>
  );
}
