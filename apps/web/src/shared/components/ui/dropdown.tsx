"use client";

import { useState, useMemo } from "react";
import { Popover } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/libs/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

interface BaseProps {
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  /** Number of items to show before enabling scroll */
  maxVisibleItems?: number;
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
  const {
    options,
    placeholder = "Dropdown",
    className,
    label,
    error,
    errorMessage,
    required,
    disabled,
    maxVisibleItems,
  } = props;
  const hasError = error || !!errorMessage;
  const [open, setOpen] = useState(false);

  const multiple = props.multiple;
  const multiValues = props.multiple ? props.values : undefined;
  const singleValue = !props.multiple ? props.value : undefined;

  const triggerLabel = useMemo(() => {
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

  const trigger = (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "cursor-pointer flex w-full items-center justify-between rounded-lg border-[1.5px] border-gray px-3 py-2 md:px-4 h-10",
            "text-sm bg-white text-black outline-none transition-colors md:text-base",
            "hover:border-primary-red focus-visible:border-primary-red",
            open && "border-primary-red",
            hasError && "border-primary-red bg-primary-red/10",
            disabled &&
              "cursor-not-allowed opacity-50 bg-gray/10 hover:border-gray focus-visible:border-gray",
            !label && !errorMessage ? className : undefined
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-primary-red transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          style={{
            width: "var(--radix-popover-trigger-width)",
            ...(maxVisibleItems ? { maxHeight: `${maxVisibleItems * 40 + 16}px` } : {}),
          }}
          className={cn(
            "z-50 flex flex-col gap-1 rounded-lg bg-white p-2 shadow-primary-red",
            maxVisibleItems ? "overflow-y-auto" : "overflow-hidden",
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
                  type="button"
                  key={option.value}
                  onClick={() => handleMultiToggle(option.value)}
                  className="cursor-pointer flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-black transition-colors hover:bg-light-gray md:px-3 md:text-base"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-xs border-2 transition-colors",
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
                type="button"
                key={option.value}
                onClick={() => handleSingleSelect(option.value)}
                className={cn(
                  "cursor-pointer block w-full rounded-md px-2 py-2 text-left text-sm transition-colors md:px-3 md:text-base",
                  isSelected ? "bg-primary-red text-white" : "text-black hover:bg-light-gray"
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

  if (!label && !errorMessage) return trigger;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm sm:text-base font-medium">
          {label}
          {required && <span className="text-primary-red"> *</span>}
        </label>
      )}
      {trigger}
      {errorMessage && <p className="text-xs sm:text-sm text-primary-red">{errorMessage}</p>}
    </div>
  );
}
