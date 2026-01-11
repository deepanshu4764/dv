import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";
import React from "react";

export const Select = React.forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";
