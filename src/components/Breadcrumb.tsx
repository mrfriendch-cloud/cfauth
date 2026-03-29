/**
 * Breadcrumb Component
 *
 * Displays the current page path with clickable navigation links.
 * Shows hierarchical navigation from Home to the current page.
 *
 * @param currentPath - Current page path (e.g., '/', '/services', '/posts/123')
 * @param customLabel - Optional custom label for the current page
 */

interface BreadcrumbProps {
  currentPath: string;
  customLabel?: string;
}

export default function Breadcrumb({
  currentPath,
  customLabel,
}: BreadcrumbProps) {
  // Parse the path into segments
  const segments = currentPath.split("/").filter(Boolean);

  // Map path segments to readable labels
  const getLabel = (segment: string, index: number): string => {
    // If it's the last segment and we have a custom label, use it
    if (index === segments.length - 1 && customLabel) {
      return customLabel;
    }

    // Check if segment is a number (likely an ID)
    if (!isNaN(Number(segment))) {
      return `#${segment}`;
    }

    // Capitalize first letter
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Build the path for each segment
  const getPath = (index: number): string => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <nav class="flex items-center gap-2 text-sm text-slate-600 mb-6">
      {/* Home link */}
      <a
        href="/"
        class="hover:text-cyan-600 transition-colors duration-300 flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </a>

      {/* Path segments */}
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const path = getPath(index);
        const label = getLabel(segment, index);

        return (
          <>
            {/* Separator */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>

            {/* Segment link or text */}
            {isLast ? (
              <span class="text-slate-900 font-medium">{label}</span>
            ) : (
              <a
                href={path}
                class="hover:text-cyan-600 transition-colors duration-300"
              >
                {label}
              </a>
            )}
          </>
        );
      })}
    </nav>
  );
}
