"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for pages with fade-in animations
 */
export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
