
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-poppins",
  {
    variants: {
      variant: {
        default: "bg-[#0184FF] text-white hover:bg-[#0062cc]", // Primary button
        secondary: "bg-[#DEDFF] text-[#0F172A] hover:bg-gray-200", // Secondary button
        destructive: "bg-[#F1272A] text-white hover:bg-red-700", // Danger button
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outlined button
        ghost: "hover:bg-accent hover:text-accent-foreground", // Ghost button
        link: "text-[#0184FF] underline-offset-4 hover:underline", // Text button
        success: "bg-[#008B1C] text-white hover:bg-green-700", // Success button
        warning: "bg-[#B75A00] text-white hover:bg-amber-700", // Warning button
        disabled: "bg-[#F1F5F9] text-[#8295A7] cursor-not-allowed hover:bg-[#F1F5F9]", // Disabled button
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
