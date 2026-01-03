"use client";

import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wrapper component for sections with staggered animations
 */
export function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainerVariants}
      className={className}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Individual item within a staggered container
 */
export function AnimatedItem({ children, className }: AnimatedItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
