import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full h-[133px] rounded-lg border border-input bg-transparent px-[16px] py-[12px] text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-[#8B0020] focus-visible:ring-2 focus-visible:ring-[#8B0020]/40 focus-visible:ring-inset hover:border-[#8B0020] hover:ring-2 hover:ring-[#8B0020]/30 hover:ring-inset aria-invalid:border-[#8B0020] aria-invalid:ring-2 aria-invalid:ring-[#8B0020]/20 aria-invalid:ring-inset aria-invalid:bg-[#8B0020]/10 md:px-[20px] md:py-[16px] md:text-sm disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-[#8B0020]/50 dark:aria-invalid:ring-[#8B0020]/40",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
