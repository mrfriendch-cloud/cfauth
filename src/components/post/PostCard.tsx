/**
 * PostCard Component
 *
 * Displays a single post in card format with image, title, description, and tags.
 * Supports hover effects and author information display.
 *
 * @param post - Post data object
 * @param showAuthor - Whether to display author information
 * @param baseUrl - Base URL for filtering (e.g., '/', '/services', '/news')
 */

import { SelectPost } from "../../db/schema";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface PostCardProps {
  post: SelectPost;
  showAuthor?: boolean;
  showStatus?: boolean;
  baseUrl?: string;
}

export default function PostCard({
  post,
  showAuthor = true,
  showStatus = false,
  baseUrl = "/",
}: PostCardProps) {
  // Parse tags from comma-separated string
  const tags = post.tags ? post.tags.split(",").map((t) => t.trim()) : [];

  // Format author ID to first 6 characters
  const authorId = post.authorId.substring(0, 6);

  // Get primary tag or fallback to category
  const primaryTag = tags[0] ?? post.category;

  return (
    <Card hover padding="none" className="group overflow-hidden">
      {/* Cover Image */}
      {post.coverImage && (
        <a
          href={`/posts/${post.id}`}
          class="block aspect-[16/9] overflow-hidden bg-slate-100"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </a>
      )}

      {/* Card Content */}
      <div class="p-5">
        {/* Header: Author Only */}
        {showAuthor && (
          <div class="flex items-center justify-end mb-3">
            <a
              href={`${baseUrl}?author=${post.authorId}`}
              class="inline-flex items-center gap-1.5 text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-700 hover:text-cyan-800 font-medium px-3 py-1.5 rounded-full border border-cyan-200 hover:border-cyan-300 transition-all duration-300 relative z-10"
              onclick="event.stopPropagation()"
            >
              <span class="text-cyan-500">Author:</span>
              <span class="font-semibold">{authorId}</span>
            </a>
          </div>
        )}

        {/* Status Badges (Draft/Pinned) */}
        {showStatus && (post.status === "draft" || post.pinned) && (
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            {post.status === "draft" && (
              <Badge variant="warning" size="sm">
                Draft
              </Badge>
            )}
            {post.pinned && (
              <Badge variant="info" size="sm">
                Pinned
              </Badge>
            )}
          </div>
        )}

        {/* Title - Clickable */}
        <a href={`/posts/${post.id}`} class="block">
          <h3 class="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-cyan-700 transition-colors duration-300">
            {post.title}
          </h3>
        </a>

        {/* Description - Clickable */}
        {post.description && (
          <a href={`/posts/${post.id}`} class="block">
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </a>
        )}
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div class="px-5 pb-4 border-t border-slate-100 pt-3">
          <div class="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <a
                href={`${baseUrl}?tag=${encodeURIComponent(tag)}`}
                class="text-xs border border-slate-200 text-slate-600 hover:border-cyan-200 hover:text-cyan-700 hover:bg-cyan-50 px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer relative z-10"
                onclick="event.stopPropagation()"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
