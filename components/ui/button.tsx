import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "default" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-accent-blue text-white hover:bg-accent-blue/90 active:bg-accent-blue/80",
      secondary: "bg-bg-elevated text-text-primary border border-border-subtle hover:bg-bg-panel hover:border-border-strong",
      ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
      outline: "border border-border-subtle text-text-primary hover:bg-bg-elevated hover:border-border-strong",
      destructive: "bg-accent-red text-white hover:bg-accent-red/90 active:bg-accent-red/80",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      default: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-wait",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
