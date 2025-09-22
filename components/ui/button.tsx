"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "touch-manipulation select-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/95 active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 active:bg-destructive/95 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline active:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3 min-h-[44px]",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 min-h-[36px]",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4 min-h-[48px]",
        icon: "size-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const [isClicking, setIsClicking] = React.useState(false)

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isClicking || props.disabled) return

      setIsClicking(true)
      onClick?.(e)

      // Reset clicking state after a short delay
      setTimeout(() => setIsClicking(false), 200)
    },
    [onClick, isClicking, props.disabled],
  )

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={asChild ? onClick : handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
