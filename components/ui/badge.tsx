import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "email" | "meeting" | "urgent" | "success" | "warning";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-bg-elevated text-text-secondary border-border-subtle",
      email: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
      meeting: "bg-accent-green/10 text-accent-green border-accent-green/20",
      urgent: "bg-accent-red/10 text-accent-red border-accent-red/20",
      success: "bg-accent-green/10 text-accent-green border-accent-green/20",
      warning: "bg-accent-orange/10 text-accent-orange border-accent-orange/20",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export interface UrgencyDotProps extends HTMLAttributes<HTMLSpanElement> {
  level: "high" | "medium" | "low";
}

const UrgencyDot = forwardRef<HTMLSpanElement, UrgencyDotProps>(
  ({ className, level, ...props }, ref) => {
    const colors = {
      high: "bg-accent-red",
      medium: "bg-accent-orange",
      low: "bg-accent-green",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          colors[level],
          className
        )}
        {...props}
      />
    );
  }
);

UrgencyDot.displayName = "UrgencyDot";

export { Badge, UrgencyDot };
