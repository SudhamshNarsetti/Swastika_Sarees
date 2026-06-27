export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  viewport: { once: true, margin: '-50px' },
};

export const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true, margin: '-50px' },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const fadeInUp = staggerItem;

export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  viewport: { once: true, margin: '-50px' },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const heroImageZoom = {
  initial: { scale: 1.05 },
  animate: { scale: 1, transition: { duration: 10, ease: 'linear' } },
};

/* --- NEW CINEMATIC & LUXURY REVEALS --- */

export const fadeScale = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  viewport: { once: true, margin: '-50px' },
};

export const slideUpFade = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  viewport: { once: true, margin: '-50px' },
};

export const blurReveal = {
  initial: { opacity: 0, filter: 'blur(10px)', y: 20 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  viewport: { once: true, margin: '-50px' },
};

export const kenBurns = {
  initial: { scale: 1 },
  animate: { scale: 1.15, transition: { duration: 15, ease: 'linear' } },
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  viewport: { once: true, margin: '-50px' },
};

