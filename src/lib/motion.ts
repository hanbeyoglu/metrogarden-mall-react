/**
 * Shared Motion (framer-motion successor) animation presets.
 * Import these variants into components for consistent animations.
 *
 * All durations are in seconds (Motion convention).
 * All easings map to our design token easing functions.
 */

// ── Easing presets ────────────────────────────────────────────────────────────

export const ease = {
  smooth: [0.22, 1, 0.36, 1] as const,      // entering elements
  inSmooth: [0.64, 0, 0.78, 0] as const,    // exiting elements
  spring: [0.34, 1.56, 0.64, 1] as const,  // subtle spring for interactive
} as const

// ── Transition presets ────────────────────────────────────────────────────────

export const transitions = {
  fast: { duration: 0.2, ease: ease.smooth },
  base: { duration: 0.35, ease: ease.smooth },
  slow: { duration: 0.6, ease: ease.smooth },
  cinematic: { duration: 1.0, ease: ease.smooth },
  exitFast: { duration: 0.15, ease: ease.inSmooth },
  exitBase: { duration: 0.2, ease: ease.inSmooth },
} as const

// ── Variant factories ──────────────────────────────────────────────────────────
// These produce Motion `Variants` objects — use with `variants` prop.

/** Standard fade-in from below. Used for cards, sections, text blocks. */
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: ease.inSmooth },
  },
}

/** Fade in from left — used for alternating content blocks */
export const fadeInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.smooth },
  },
}

/** Fade in from right */
export const fadeInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.smooth },
  },
}

/** Simple opacity fade — for overlays, modals, page transitions */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: ease.inSmooth },
  },
}

/** Scale in from slightly smaller — for modals, drawers */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2, ease: ease.inSmooth },
  },
}

/** Page transition wrapper */
export const pageTransition = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: ease.inSmooth },
  },
}

/** Hero text lines — cinematic staggered entrance */
export const heroText = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.smooth },
  },
}

/**
 * Stagger container — apply to the parent element.
 * Children will inherit the stagger delay.
 */
export function staggerContainer(staggerMs = 80) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerMs / 1000,
        delayChildren: 0,
      },
    },
  }
}

/**
 * Creates a fadeInUp variant with a custom delay.
 * Use when you need to offset a specific item beyond the stagger.
 */
export function fadeInUpDelayed(delayMs: number) {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: ease.smooth,
        delay: delayMs / 1000,
      },
    },
  }
}

// ── Scroll-reveal defaults ─────────────────────────────────────────────────────

/** Default whileInView config — used by ScrollReveal component */
export const scrollRevealViewport = {
  once: true,
  amount: 0.15,
} as const
