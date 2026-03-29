import { SelectPost } from "../db/schema";

import MainLayout from "../layouts/MainLayout";
import PostsList from "../components/PostsList";

const markedAssets = (
  <script src="https://cdn.jsdelivr.net/npm/marked@4/lib/marked.umd.min.js"></script>
);

export default function Posts({
  posts,
  isAdmin = false,
}: {
  posts: SelectPost[];
  isAdmin?: boolean;
}) {
  return (
    <MainLayout
      isLoggedIn
      isAdmin={isAdmin}
      extraHeadAssets={markedAssets}
      currentPath="/posts"
    >
      <div class="mt-8 w-full dark:text-white">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl">Your Posts 👇</h1>
          <a
            href="/write"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded"
          >
            Write Post
          </a>
        </div>
        <PostsList posts={posts} />
      </div>
    </MainLayout>
  );
}
