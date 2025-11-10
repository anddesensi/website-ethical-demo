import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-light transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-black text-white hover:bg-black/90 shadow-lg": variant === "default",
            "border border-black/20 bg-white hover:bg-black/5 text-black": variant === "outline",
            "bg-black/5 text-black hover:bg-black/10 border border-black/10": variant === "secondary",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
