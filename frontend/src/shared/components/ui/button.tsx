import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        red: "bg-primary-red text-white hover:bg-dark-red active:bg-darker-red focus-visible:ring-primary-red",
        navy: "bg-primary-navy text-white hover:bg-dark-navy active:bg-darker-navy focus-visible:ring-primary-navy",
        yellow:
          "bg-primary-yellow text-primary-navy hover:bg-dark-yellow active:bg-darker-yellow focus-visible:ring-primary-yellow",
      },
      size: {
        default: "w-[147px] h-[48px] text-lg gap-2",
        md: "w-[132px] h-[38px] text-base gap-1.5",
        sm: "w-[122px] h-[31px] text-sm gap-1.5",
        xs: "w-[95px] h-[24px] text-xs gap-1 [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "red",
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
  variant = "navy",
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
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size, className }))}
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
