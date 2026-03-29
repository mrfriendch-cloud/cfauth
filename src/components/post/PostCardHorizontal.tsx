/**
 * PostCardHorizontal Component
 *
 * Displays a single post in horizontal card format (flex-row layout).
 * Used for Services and News pages with side-by-side image and content.
 *
 * @param post - Post data object
 * @param showAuthor - Whether to display author information
 * @param baseUrl - Base URL for filtering (e.g., '/services', '/news')
 */

import { SelectPost } from "../../db/schema";
import Card from "../ui/Card";

interface PostCardHorizontalProps {
  post: SelectPost;
  showAuthor?: boolean;
  baseUrl?: string;
}

export default function PostCardHorizontal({
  post,
  showAuthor = true,
  baseUrl = "/",
}: PostCardHorizontalProps) {
  // Parse tags from comma-separated string
  const tags = post.tags
    ? post.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Format author ID to first 6 characters
  const authorId = post.authorId.substring(0, 6);

  // Get primary tag or fallback to category
  const primaryTag = tags[0] ?? post.category;

  return (
    <Card hover padding="none" className="group overflow-hidden">
      <div class="flex flex-col sm:flex-row gap-4">
        {/* Cover Image - Left side, fixed width on desktop */}
        {post.coverImage && (
          <a
            href={`/posts/${post.id}`}
            class="sm:w-64 shrink-0 aspect-[16/9] sm:aspect-auto overflow-hidden bg-slate-100 block"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </a>
        )}

        {/* Card Content - Right side */}
        <div class="flex-1 flex flex-col min-w-0 p-4 sm:py-4 sm:pr-4 sm:pl-0">
          {/* Header: Author */}
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

          {/* Title - Clickable */}
          <a href={`/posts/${post.id}`} class="block">
            <h3 class="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-cyan-700 transition-colors duration-300">
              {post.title}
            </h3>
          </a>

          {/* Description - Clickable */}
          <a href={`/posts/${post.id}`} class="block flex-1">
            {post.description && (
              <p class="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {post.description}
              </p>
            )}
          </a>

          {/* Tags Section */}
          {tags.length > 0 && (
            <div class="border-t border-slate-100 pt-3 mt-auto">
              <div class="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <a
                    href={`${baseUrl}?tag=${encodeURIComponent(tag)}`}
                    class="text-xs border border-slate-200 text-slate-600 hover:border-cyan-200 hover:text-cyan-700 hover:bg-cyan-50 px-2.5 py-1 rounded-lg transition-all duration-300 cursor-pointer relative z-10"
                    onclick="event.stopPropagation()"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
