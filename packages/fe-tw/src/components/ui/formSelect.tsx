"use client"

import type * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./select";

interface FormSelectProps extends React.ComponentProps<typeof Select> {
   required?: boolean;
   label: string;
   name: string;
   error?: string;
   description?: string;
   className?: string;
   placeholder?: string;
   children: React.ReactNode;
}

function FormSelect({
   required,
   label,
   description,
   name,
   error,
   className,
   placeholder,
   children,
   ...props
}: FormSelectProps) {
   return (
      <div className="w-full">
         <Label htmlFor={name} className="gap-1">
            {label}
            {required && <span className={"text-red-500"}>*</span>}
         </Label>
         <Select
            name={name}
            {...props}
         >
            <SelectTrigger
               id={name}
               aria-invalid={!!error}
               className={cn(
                  "mt-1",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-red-500",
                  className,
               )}
            >
               <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
               {children}
            </SelectContent>
         </Select>
         {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
         {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </div>
   );
}

export { FormSelect };