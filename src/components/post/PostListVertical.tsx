/**
 * PostListVertical Component
 *
 * Displays a vertical list of post cards (flex-col layout).
 * Shows empty state when no posts are available.
 * Used for Services and News pages.
 *
 * @param posts - Array of post objects
 * @param id - Container ID for HTMX targeting
 * @param baseUrl - Base URL for filtering
 * @param emptyMessage - Message to display when no posts found
 */

import { SelectPost } from "../../db/schema";
import PostCardHorizontal from "./PostCardHorizontal";

interface PostListVerticalProps {
  posts: SelectPost[];
  id: string;
  baseUrl?: string;
  emptyMessage?: string;
}

export default function PostListVertical({
  posts,
  id,
  baseUrl = "/",
  emptyMessage = "No posts found.",
}: PostListVerticalProps) {
  // Empty state
  if (posts.length === 0) {
    return (
      <div id={id} class="py-12 text-center text-slate-400 text-sm italic">
        {emptyMessage}
      </div>
    );
  }

  // Vertical list layout with gap
  return (
    <div id={id} class="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCardHorizontal post={post} baseUrl={baseUrl} />
      ))}
    </div>
  );
}
