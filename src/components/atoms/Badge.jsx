import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-gray-100 text-gray-800": variant === "default",
          "bg-gray-100 text-gray-800": variant === "secondary", 
          "bg-red-100 text-red-800": variant === "destructive" || variant === "error",
          "bg-gray-900 text-gray-50": variant === "outline",
          "bg-green-100 text-green-800": variant === "success",
          "bg-yellow-100 text-yellow-800": variant === "warning",
          "bg-blue-100 text-blue-800": variant === "info",
        },
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge