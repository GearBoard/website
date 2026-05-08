"use client";

import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const DropdownMenuRoot = DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenu.Trigger;
const DropdownMenuGroup = DropdownMenu.Group;
const DropdownMenuPortal = DropdownMenu.Portal;
const DropdownMenuSub = DropdownMenu.Sub;
const DropdownMenuRadioGroup = DropdownMenu.RadioGroup;

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[220px] overflow-hidden rounded-xl border border-light-gray bg-white p-1.5 text-primary-navy shadow-black",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenu.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
      "focus:bg-light-gray data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      destructive && "text-primary-red focus:text-primary-red",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg py-2 pr-3 pl-8 text-sm outline-none transition-colors",
      "focus:bg-light-gray data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenu.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg py-2 pr-3 pl-8 text-sm outline-none transition-colors",
      "focus:bg-light-gray data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenu.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenu.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-xs font-semibold text-gray", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-light-gray", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenu.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none",
      "focus:bg-light-gray data-[state=open]:bg-light-gray",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenu.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenu.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-light-gray bg-white p-1.5 text-primary-navy shadow-black",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto text-xs tracking-widest text-gray", className)} {...props} />;
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
