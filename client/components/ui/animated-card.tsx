"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cardHoverVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import * as React from "react";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  children?: React.ReactNode;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHoverVariants}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedCard.displayName = "AnimatedCard";

const AnimatedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
AnimatedCardHeader.displayName = "AnimatedCardHeader";

const AnimatedCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
AnimatedCardTitle.displayName = "AnimatedCardTitle";

const AnimatedCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AnimatedCardDescription.displayName = "AnimatedCardDescription";

const AnimatedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
AnimatedCardContent.displayName = "AnimatedCardContent";

const AnimatedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
AnimatedCardFooter.displayName = "AnimatedCardFooter";

export {
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardFooter,
  AnimatedCardTitle,
  AnimatedCardDescription,
  AnimatedCardContent,
};
