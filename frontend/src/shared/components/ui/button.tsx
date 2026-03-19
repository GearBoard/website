import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[8] border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer active:cursor-default",
  {
    variants: {
      color: {
        red: "bg-primary-red text-white hover:bg-dark-red active:bg-darker-red focus-visible:ring-primary-red",
        navy: "bg-primary-navy text-white hover:bg-dark-navy active:bg-darker-navy focus-visible:ring-primary-navy",
        yellow:
          "bg-primary-yellow text-primary-navy hover:bg-dark-yellow active:bg-darker-yellow focus-visible:ring-primary-yellow",
      },
      size: {
        default: "px-[20] py-[12] text-lg gap-8",
        md: "px-[16] py-[8] text-base gap-8",
        sm: "px-[16] py-[6] text-sm gap-8",
        xs: "px-[8] py-[4] text-xs gap-8 [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      color: "red",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({
  className,
  color = "red",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      data-variant={color}
      data-size={size}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(buttonVariants({ color, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          <span className="sr-only">Loading…</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
