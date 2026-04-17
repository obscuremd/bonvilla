import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
  All colours come from CSS variables defined in globals.css.
  To retheme the entire button system, edit --color-gold,
  --color-bg, etc. in :root — no code changes needed.
*/
const buttonVariants = cva(
  // ── shared base ──
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 active:scale-[0.97] select-none cursor-pointer",
  {
    variants: {
      variant: {
        // Gold fill — primary CTA
        default: "btn-primary",
        // Transparent + border
        outline: "btn-outline",
        // Minimal text / underline
        ghost:
          "btn-text border-0 p-0 h-auto rounded-none normal-case tracking-normal font-medium text-[--muted-foreground] hover:text-[--color-gold]",
        // Danger / destructive
        destructive: "btn-danger",
        // Muted surface fill (used in CMS)
        secondary:
          "bg-[--secondary] text-[--secondary-foreground] border border-[--border] rounded-lg hover:bg-[--color-elevated] transition-colors",
        // Plain link
        link: "text-[--color-gold] underline-offset-4 hover:underline rounded-none p-0 h-auto font-normal normal-case tracking-normal",
      },
      size: {
        default: "h-10 px-6 text-xs rounded-full",
        sm: "h-8 px-4 text-[0.7rem] rounded-full",
        lg: "h-12 px-8 text-sm rounded-full",
        xl: "h-14 px-10 text-sm rounded-full",
        icon: "size-9 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
