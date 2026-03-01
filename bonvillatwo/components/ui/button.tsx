import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-[#f4d6a4] focus-visible:ring-offset-2 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[#5b1619] text-white rounded-full shadow-md hover:shadow-xl hover:shadow-[#5b1619]/20 hover:-translate-y-[1px] hover:bg-[#4a1113]",

        destructive:
          "bg-red-600 text-white rounded-full hover:bg-red-700 hover:shadow-lg",

        outline:
          "border border-[#5b1619]/25 text-[#5b1619] bg-transparent rounded-full hover:border-[#5b1619] hover:bg-[#5b1619] hover:text-white",

        secondary:
          "bg-[#f4d6a4]/30 text-[#5b1619] rounded-full border border-[#f4d6a4]/50 hover:bg-[#f4d6a4]/60 hover:shadow-sm",

        ghost:
          "text-[#425362] rounded-full hover:bg-[#425362]/8 hover:text-[#5b1619]",

        link: "text-[#5b1619] underline-offset-4 hover:underline rounded-none p-0 h-auto",

        pill: "bg-[#5b1619] text-[#f4d6a4] rounded-full tracking-wide hover:bg-[#4a1113] hover:shadow-xl hover:shadow-[#5b1619]/25 hover:-translate-y-[1px]",
      },
      size: {
        default: "h-10 px-6 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "size-10 rounded-full",
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
