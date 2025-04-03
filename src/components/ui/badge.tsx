
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-poppins",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0184FF] text-white", // Primary badge
        secondary: "border-transparent bg-[#DEDFF] text-[#0F172A]", // Secondary badge
        destructive: "border-transparent bg-[#F1272A] text-white", // Destructive badge
        outline: "text-foreground border-[#E4E9FD]", // Outline badge
        success: "border-transparent bg-[#D0FFEB] text-[#008B1C]", // Success badge
        warning: "border-transparent bg-[#FFF7E1] text-[#B75A00]", // Warning badge
        disabled: "border-transparent bg-[#F1F5F9] text-[#8295A7]", // Disabled badge
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
