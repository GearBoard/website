"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const searchbarVariants = cva(
  "group flex items-center bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-[10px] px-4 py-3 sm:px-5 sm:py-4 gap-[10px] w-full sm:w-[478px] border-2 border-transparent transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        hovered: "border-primary-red",
        focus: "border-primary-red",
        disabled: "opacity-50 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SearchbarProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof searchbarVariants> {
  containerClassName?: string;
}

const Searchbar = React.forwardRef<HTMLInputElement, SearchbarProps>(
  ({ className, variant, containerClassName, disabled, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    // Automatically switch to focus variant when internal input is focused
    const activeVariant = disabled ? "disabled" : isFocused ? "focus" : variant;

    return (
      <div
        className={cn(
          searchbarVariants({ variant: activeVariant }),
          "hover:border-primary-red", // Handle hover state via CSS
          containerClassName
        )}
      >
        <Search
          className={cn(
            "size-[18px] transition-colors",
            disabled ? "text-primary-red/50" : "text-primary-red"
          )}
        />
        <input
          {...props}
          ref={ref}
          disabled={disabled}
          placeholder={isFocused ? "" : (props.placeholder ?? "ค้นหาวิชา, อาจารย์ หรือข้อสอบ")}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "bg-transparent outline-none w-full font-satoshi text-[18px] text-primary-navy placeholder:text-gray/60",
            className
          )}
        />
      </div>
    );
  }
);

Searchbar.displayName = "Searchbar";

export { Searchbar };
