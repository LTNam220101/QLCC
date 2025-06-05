import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2 py-2 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-2 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        green:
          "border-green bg-green text-green-foreground [a&]:hover:bg-green/90",
        green_outline:
          "border-transparent bg-green/10 text-green [a&]:hover:bg-green/30",
        blue: "border-blue bg-blue text-blue-foreground [a&]:hover:bg-blue/90",
        blue_outline:
          "border-transparent bg-blue/10 text-blue [a&]:hover:bg-blue/30",
        orange:
          "border-orange bg-orange text-orange-foreground [a&]:hover:bg-orange/90",
        orange_outline:
          "border-transparent bg-orange/10 text-orange [a&]:hover:bg-orange/30",
        red: "border-red bg-red text-red-foreground [a&]:hover:bg-red/90",
        red_outline:
          "border-transparent bg-red/10 text-red [a&]:hover:bg-red/30",
        gray: "border-gray bg-gray text-gray-foreground [a&]:hover:bg-gray/90",
        gray_outline:
          "border-transparent bg-gray/10 text-gray [a&]:hover:bg-gray/30",
        purple: "border-purple bg-purple text-purple-foreground [a&]:hover:bg-purple/90",
        purple_outline:
          "border-transparent bg-purple/10 text-purple [a&]:hover:bg-purple/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/10 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        destructive_outline:
          "border-transparent bg-destructive/10 text-destructive [a&]:hover:bg-destructive/30 focus-visible:ring-destructive/10 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)
const dotVariants = cva(
  "w-2 h-2 p-1 m-0 rounded-full",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        green:
          "border-green bg-green text-green-foreground [a&]:hover:bg-green/90",
        green_outline:
          "border-transparent bg-green text-green [a&]:hover:bg-green/30",
        blue: "border-blue bg-blue text-blue-foreground [a&]:hover:bg-blue/90",
        blue_outline:
          "border-transparent bg-blue text-blue [a&]:hover:bg-blue/30",
        orange:
          "border-orange bg-orange text-orange-foreground [a&]:hover:bg-orange/90",
        orange_outline:
          "border-transparent bg-orange text-orange [a&]:hover:bg-orange/30",
        red: "border-red bg-red text-red-foreground [a&]:hover:bg-red/90",
        red_outline:
          "border-transparent bg-red text-red [a&]:hover:bg-red/30",
        gray: "border-gray bg-gray text-gray-foreground [a&]:hover:bg-gray/90",
        gray_outline:
          "border-transparent bg-gray text-gray [a&]:hover:bg-gray/30",
        purple: "border-purple bg-purple text-purple-foreground [a&]:hover:bg-purple/90",
        purple_outline:
          "border-transparent bg-purple text-purple [a&]:hover:bg-purple/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        destructive_outline:
          "border-transparent bg-destructive text-destructive [a&]:hover:bg-destructive/30 focus-visible:ring-destructive/10 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
      <div className={cn(dotVariants({ variant }))} />
    </Comp>
  )
}

export { Badge, badgeVariants }
