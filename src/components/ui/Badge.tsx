/**
 * Badge Component
 *
 * A small label component for displaying status, categories, or tags.
 * Supports multiple color variants and sizes.
 *
 * @param variant - Color variant (default, primary, success, warning, danger, info)
 * @param size - Badge size (sm, md, lg)
 * @param children - Badge content
 * @param className - Additional CSS classes
 */

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: any;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  primary: "bg-cyan-50 text-cyan-700 border-cyan-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export default function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-block font-semibold tracking-widest uppercase border rounded-full";
  const variantStyles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];

  const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

  return <span class={combinedClassName}>{children}</span>;
}
