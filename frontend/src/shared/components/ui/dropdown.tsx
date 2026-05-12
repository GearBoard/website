"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

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

  const hasSelection = props.multiple ? (props.values?.length ?? 0) > 0 : !!props.value;

  const triggerLabel = React.useMemo(() => {
    if (props.multiple) {
      const selected = props.values ?? [];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1)
        return options.find((o) => o.value === selected[0])?.label ?? placeholder;
      return `${selected.length} selected`;
    }
    if (!props.value) return placeholder;
    return options.find((o) => o.value === props.value)?.label ?? placeholder;
  }, [props, options, placeholder]);

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
            "flex w-full items-center justify-between rounded border border-gray px-3 py-2 text-sm outline-none transition-colors",
            "hover:border-primary-red focus-visible:border-primary-red",
            open && "border-primary-red",
            hasSelection ? "text-darker-navy" : "text-dark-navy",
            className
          )}
        >
          <span>{triggerLabel}</span>
          <TriangleIcon
            className={cn(
              "w-[8px] h-[5px] shrink-0 text-primary-red transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          className={cn(
            "z-50 overflow-hidden rounded border border-light-gray bg-white py-1 shadow-black",
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
                  className="flex mx-1 w-[calc(100%-0.5rem)] items-center gap-2 rounded px-3 py-2 text-sm text-darker-navy transition-colors hover:bg-light-gray"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-none border transition-colors",
                      isChecked ? "border-primary-red bg-primary-red" : "border-primary-red"
                    )}
                  >
                    {isChecked && <Check className="size-3 text-white" strokeWidth={3} />}
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
                  "block mx-1 w-[calc(100%-0.5rem)] rounded px-3 py-2 text-left text-sm transition-colors",
                  isSelected ? "bg-primary-red text-white" : "text-darker-navy hover:bg-light-gray"
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
