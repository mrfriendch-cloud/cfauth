/**
 * SearchInput Component
 *
 * A search input field with icon and HTMX integration.
 * Supports debounced search with customizable delay.
 *
 * @param placeholder - Input placeholder text
 * @param value - Current input value
 * @param name - Input name attribute
 * @param hxGet - HTMX endpoint URL
 * @param hxTarget - HTMX target selector
 * @param hxInclude - HTMX include selector
 * @param className - Additional CSS classes
 */

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  name?: string;
  hxGet?: string;
  hxTarget?: string;
  hxInclude?: string;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search...",
  value = "",
  name = "search",
  hxGet,
  hxTarget,
  hxInclude,
  className = "",
}: SearchInputProps) {
  const containerStyles =
    "flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 focus-within:ring-1 focus-within:ring-cyan-500/50 bg-slate-50 transition-all duration-300";

  return (
    <div class={`${containerStyles} ${className}`}>
      {/* Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-3.5 h-3.5 text-slate-400 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>

      {/* Input Field */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        name={name}
        hx-get={hxGet}
        hx-trigger="input changed delay:300ms"
        hx-target={hxTarget}
        hx-swap="outerHTML"
        hx-include={hxInclude}
        class="flex-1 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
      />
    </div>
  );
}
