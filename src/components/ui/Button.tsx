/**
 * Button Component
 *
 * A reusable button component with multiple variants and sizes.
 * Supports gradient backgrounds, icons, and loading states.
 *
 * @param variant - Visual style variant (primary, secondary, success, danger)
 * @param size - Button size (sm, md, lg)
 * @param fullWidth - Whether button should take full width
 * @param children - Button content
 * @param className - Additional CSS classes
 */

type ButtonVariant = "primary" | "secondary" | "success" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: any;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/50",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
  success:
    "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/50",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg hover:shadow-red-500/50",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  href,
  type = "button",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-2";
  const variantStyles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${className}`;

  if (href) {
    return (
      <a href={href} class={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} class={combinedClassName} onclick={onClick}>
      {children}
    </button>
  );
}
