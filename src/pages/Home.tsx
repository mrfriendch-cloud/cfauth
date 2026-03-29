/**
 * Home Page (Refactored)
 *
 * Main landing page displaying featured post, post grid, and sidebar filters.
 * Supports search, category filtering, tag filtering, and author filtering.
 * Includes pagination for browsing multiple pages of posts.
 */

import { SelectPost } from "../db/schema";
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/hero/Hero";
import PostGrid from "../components/post/PostGrid";
import Sidebar from "../components/sidebar/Sidebar";
import Pagination from "../components/pagination/Pagination";

// ── Post Cards Component (for HTMX partial rendering) ────────────────────────
export function HomePostCards({ posts }: { posts: SelectPost[] }) {
  return <PostGrid posts={posts} id="home-post-cards" baseUrl="/" />;
}

// ── Home Page Props Interface ─────────────────────────────────────────────────
interface HomeProps {
  pinnedPost: SelectPost | null;
  publishedPosts: SelectPost[];
  allTags: string[];
  activeSearch?: string;
  activeCategory?: string;
  activeTag?: string;
  activeAuthor?: string;
  currentPage?: number;
  totalCount?: number;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

// ── Home Page Component ───────────────────────────────────────────────────────
export default function Home({
  pinnedPost,
  publishedPosts,
  allTags,
  activeSearch = "",
  activeCategory = "All",
  activeTag = "",
  activeAuthor = "",
  currentPage = 1,
  totalCount = 0,
  isLoggedIn = false,
  isAdmin = false,
}: HomeProps) {
  // Calculate pagination
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Category options
  const CATEGORIES = ["All", "Products", "Services", "News"] as const;

  return (
    <MainLayout isLoggedIn={isLoggedIn} isAdmin={isAdmin} currentPath="/">
      {/* Hero Section */}
      <Hero pinnedPost={pinnedPost} isLoggedIn={isLoggedIn} />

      {/* Main Content: Sidebar + Posts */}
      <section class="pb-16 flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar with Filters */}
        <Sidebar
          searchValue={activeSearch}
          activeCategory={activeCategory}
          activeTag={activeTag}
          activeAuthor={activeAuthor}
          allTags={allTags}
          categories={CATEGORIES}
          hxGet="/api/home/posts"
          currentPage={currentPage}
        />

        {/* Post Grid */}
        <div class="flex-1 min-w-0">
          <HomePostCards posts={publishedPosts} />
        </div>
      </section>

      {/* Auth Links for Non-Logged-In Users */}
      {!isLoggedIn && (
        <div class="pb-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <a href="/login" class="text-blue-900 font-medium hover:underline">
            Log in
          </a>
          {" · "}
          <a href="/signup" class="text-blue-900 font-medium hover:underline">
            Sign up
          </a>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/"
        searchValue={activeSearch}
        categoryValue={activeCategory}
        tagValue={activeTag}
        authorValue={activeAuthor}
      />
    </MainLayout>
  );
}
