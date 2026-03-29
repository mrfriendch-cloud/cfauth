/**
 * Card Component
 *
 * A flexible card container with consistent styling.
 * Supports hover effects, borders, and custom padding.
 *
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param hover - Enable hover effects
 * @param padding - Padding size (none, sm, md, lg)
 */

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: any;
  className?: string;
  hover?: boolean;
  padding?: CardPadding;
}

const PADDING_STYLES: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  const baseStyles =
    "border border-slate-200 rounded-xl bg-white transition-all duration-300";
  const hoverStyles = hover
    ? "hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
    : "";
  const paddingStyles = PADDING_STYLES[padding];

  const combinedClassName = `${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`;

  return <div class={combinedClassName}>{children}</div>;
}
