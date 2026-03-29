/**
 * PostGrid Component
 *
 * Displays a grid of post cards with responsive layout.
 * Shows empty state when no posts are available.
 *
 * @param posts - Array of post objects
 * @param id - Container ID for HTMX targeting
 * @param baseUrl - Base URL for filtering
 * @param emptyMessage - Message to display when no posts found
 */

import { SelectPost } from "../../db/schema";
import PostCard from "./PostCard";

interface PostGridProps {
  posts: SelectPost[];
  id: string;
  baseUrl?: string;
  showStatus?: boolean;
  emptyMessage?: string;
}

export default function PostGrid({
  posts,
  id,
  baseUrl = "/",
  showStatus = false,
  emptyMessage = "No posts found.",
}: PostGridProps) {
  // Empty state
  if (posts.length === 0) {
    return (
      <div id={id} class="py-12 text-center text-slate-400 text-sm italic">
        {emptyMessage}
      </div>
    );
  }

  // Grid layout with responsive columns
  return (
    <div id={id} class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard post={post} baseUrl={baseUrl} showStatus={showStatus} />
      ))}
    </div>
  );
}
