/**
 * Animation Utilities for PrivGPT Studio
 * 
 * This file contains reusable Framer Motion variants and animation configurations
 * for consistent, performant animations throughout the application.
 */

import { Variants } from "framer-motion";

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// ============================================================================
// FADE IN ANIMATIONS
// ============================================================================

export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInUpVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInDownVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: -30
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHoverVariants: Variants = {
  rest: { 
    scale: 1,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  tap: {
    scale: 0.98
  }
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

export const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromLeftVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -50
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const slideInFromRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 50
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const spinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// ============================================================================
// LINK/ANCHOR ANIMATIONS
// ============================================================================

export const linkHoverVariants: Variants = {
  rest: { 
    scale: 1,
    color: "inherit"
  },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a stagger container with custom delay
 */
export const getStaggerContainer = (staggerDelay: number = 0.1, delayChildren: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
});

/**
 * Generate custom fade in with delay
 */
export const getFadeInWithDelay = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

/**
 * Intersection observer animation trigger configuration
 */
export const viewportConfig = {
  once: true, // Animate only once
  margin: "-50px", // Trigger animation 50px before element comes into view
  amount: 0.3 // Trigger when 30% of element is visible
};
