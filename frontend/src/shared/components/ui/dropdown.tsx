"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { cn } from "@/shared/lib/utils";

function CheckIcon() {
  return (
    <svg viewBox="-1 -1 14 14" fill="none" className="size-3" aria-hidden>
      <polyline
        points="0.75,6 4.25,9.5 11.25,2.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function TriangleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 6" className={className} fill="currentColor" aria-hidden>
      <polygon points="0,0 10,0 5,6" />
    </svg>
  );
}

export interface DropdownOption {
  value: string;
  label: string;
}

interface BaseProps {
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

interface SingleProps extends BaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

interface MultiProps extends BaseProps {
  multiple: true;
  values?: string[];
  onChange?: (values: string[]) => void;
}

export type DropdownProps = SingleProps | MultiProps;

export function Dropdown(props: DropdownProps) {
  const { options, placeholder = "Dropdown", className } = props;
  const [open, setOpen] = React.useState(false);

  const multiple = props.multiple;
  const multiValues = props.multiple ? props.values : undefined;
  const singleValue = !props.multiple ? props.value : undefined;

  const triggerLabel = React.useMemo(() => {
    if (multiple) {
      const selected = multiValues ?? [];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1)
        return options.find((o) => o.value === selected[0])?.label ?? placeholder;
      return `${selected.length} selected`;
    }
    if (!singleValue) return placeholder;
    return options.find((o) => o.value === singleValue)?.label ?? placeholder;
  }, [multiple, multiValues, singleValue, options, placeholder]);

  function handleSingleSelect(value: string) {
    if (!props.multiple) {
      props.onChange?.(value);
      setOpen(false);
    }
  }

  function handleMultiToggle(value: string) {
    if (props.multiple) {
      const current = props.values ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      props.onChange?.(next);
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-[10px] border-2 border-transparent px-5 py-2.5",
            "text-lg font-[700] tracking-[-0.02em] text-[#262626] outline-none transition-colors shadow-black",
            "hover:border-primary-red focus-visible:border-primary-red",
            open && "border-primary-red",
            className
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <TriangleIcon
            className={cn(
              "w-[10px] h-[5px] shrink-0 text-primary-red transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          className={cn(
            "z-50 flex flex-col gap-2 overflow-hidden rounded-[15px] bg-white p-[5px] shadow-black",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {options.map((option) => {
            if (props.multiple) {
              const isChecked = (props.values ?? []).includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleMultiToggle(option.value)}
                  className="flex w-full items-center gap-[15px] rounded-[10px] px-5 py-1.5 text-lg font-[700] tracking-[-0.02em] text-[#262626] transition-colors hover:bg-light-gray"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[2px] border-2 transition-colors",
                      isChecked ? "border-primary-red bg-primary-red" : "border-primary-red"
                    )}
                  >
                    {isChecked && <CheckIcon />}
                  </span>
                  {option.label}
                </button>
              );
            }

            const isSelected = props.value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSingleSelect(option.value)}
                className={cn(
                  "block w-full rounded-[10px] px-5 py-2 text-left text-lg font-[700] tracking-[-0.02em] transition-colors",
                  isSelected ? "bg-primary-red text-white" : "text-[#262626] hover:bg-light-gray"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
