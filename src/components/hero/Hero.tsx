/**
 * Hero Component
 *
 * Displays a prominent hero section with featured post or welcome message.
 * Includes title, description, CTA button, and optional cover image.
 * Responsive layout with image positioning.
 *
 * @param pinnedPost - Featured post to display (optional)
 * @param isLoggedIn - Whether user is logged in
 */

import { SelectPost } from "../../db/schema";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface HeroProps {
  pinnedPost: SelectPost | null;
  isLoggedIn?: boolean;
}

export default function Hero({ pinnedPost, isLoggedIn = false }: HeroProps) {
  // Extract first tag from pinned post
  const firstTag = pinnedPost?.tags
    ? pinnedPost.tags.split(",")[0].trim()
    : null;

  // Get cover image URL
  const coverImage = pinnedPost?.coverImage || null;

  // Determine title, description, and CTA
  const title = pinnedPost ? pinnedPost.title : "Welcome to Nega";
  const description =
    pinnedPost?.description ??
    "A place for technical writing, ideas, and deep dives.";
  const ctaText = pinnedPost ? "Read More" : "Get started";
  const ctaHref = pinnedPost ? `/posts/${pinnedPost.id}` : "/signup";

  return (
    <section class="py-12 md:py-16">
      {/* Mobile Cover Image */}
      {coverImage && (
        <a
          href={ctaHref}
          class="block md:hidden mb-8 w-full rounded-2xl overflow-hidden shadow-lg shadow-cyan-500/20 aspect-[16/9] group"
        >
          <img
            src={coverImage}
            alt={title}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </a>
      )}

      {/* Hero Content */}
      <div class="flex flex-col md:flex-row md:items-start gap-10">
        {/* Left Column: Text Content */}
        <div class="flex flex-col flex-1 min-w-0">
          {/* Tag Badge */}
          <div class="mb-5">
            <Badge variant="primary" size="md">
              {firstTag ?? "Featured"}
            </Badge>
          </div>

          {/* Title - clickable when pinned post exists */}
          {pinnedPost ? (
            <a href={ctaHref} class="group mb-6">
              <h1 class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
                {title}
              </h1>
            </a>
          ) : (
            <h1 class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight mb-6">
              {title}
            </h1>
          )}

          {/* Description */}
          <p class="text-slate-600 text-base md:text-lg leading-relaxed mb-10">
            {description}
          </p>

          {/* CTA Button */}
          <div>
            <Button variant="primary" size="lg" href={ctaHref}>
              {ctaText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Right Column: Desktop Cover Image */}
        <div class="hidden md:block shrink-0 w-1/3 pt-[4.5rem]">
          {coverImage ? (
            <a
              href={ctaHref}
              class="group block rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500"
            >
              <img
                src={coverImage}
                alt={title}
                class="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
              />
            </a>
          ) : (
            <div class="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-16 h-16 text-slate-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
