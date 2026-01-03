"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { buttonPressVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
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
);

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof animatedButtonVariants> {}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        className={cn(animatedButtonVariants({ variant, size, className }))}
        ref={ref}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={buttonPressVariants}
        {...props}
      />
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };
