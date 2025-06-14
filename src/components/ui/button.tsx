import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-green text-green-foreground shadow-xs hover:bg-green/90",
        warning: "bg-red text-red-foreground shadow-xs hover:bg-red/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "bg-[#E4E6E8] cursor-default text-white",
        link: "text-primary underline-offset-4 hover:underline",
        purple: "bg-purple text-purple-foreground shadow-xs hover:bg-purple/90",
        green: "bg-green text-green-foreground shadow-xs hover:bg-green/90",
        gray: "bg-gray text-gray-foreground shadow-xs hover:bg-gray/90",
        transparent: "hover:bg-accent hover:text-accent-foreground",
        black:
          "text-primary-foreground underline-offset-4 hover:underline bg-primary hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
      },
      size: {
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-4 py-2 has-[>svg]:px-3",
        xl: "h-12 rounded-lg px-4",
        icon: "size-8 rounded-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "lg"
    }
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
