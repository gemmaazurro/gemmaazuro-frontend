'use client';
import { AnimatePresence, motion, type Variants, type Transition } from 'motion/react';
import React, { Fragment, useMemo } from 'react';

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';
export type PerType = 'word' | 'char' | 'line';

export type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: { container?: Variants; item?: Variants };
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 1, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  fade: {
    container: defaultContainerVariants,
    item: defaultItemVariants,
  },
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 10, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 10, filter: 'blur(12px)' },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const splitSegments = (text: string, per: PerType): string[] => {
  if (per === 'line') return text.split('\n');
  if (per === 'word') return text.split(/(\s+)/).filter((s) => s.length > 0);
  return text.split('');
};

/**
 * Per-segment (char/word/line) reveal animation, ported from motion-primitives'
 * TextEffect (https://motion-primitives.com/docs/text-effect). Used on primary
 * page headings — a small, deliberate motion moment rather than everywhere.
 */
export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  const segments = useMemo(() => splitSegments(children.trim(), per), [children, per]);
  const MotionTag = motion[as as 'p'] ?? motion.p;

  const baseVariants = presetVariants[preset] ?? presetVariants.fade;
  const stagger = defaultStaggerTimes[per] / speedReveal;

  const container: Variants = {
    ...(variants?.container ?? baseVariants.container),
    visible: {
      ...(variants?.container?.visible ?? baseVariants.container.visible),
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
        ...containerTransition,
      },
    },
    exit: {
      ...(variants?.container?.exit ?? baseVariants.container.exit),
      transition: {
        staggerChildren: stagger,
        staggerDirection: -1,
        ...containerTransition,
      },
    },
  };

  const item: Variants = variants?.item ?? baseVariants.item;
  const itemDuration = 0.3 / speedSegment;

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          className={className}
          style={style}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={container}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
        >
          {per !== 'line' && <span style={{ display: 'inline', position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{children}</span>}
          {segments.map((segment, i) => (
            <Fragment key={`${per}-${i}-${segment}`}>
              <motion.span
                aria-hidden={per !== 'line'}
                className={segmentWrapperClassName}
                style={{ display: per === 'line' ? 'block' : 'inline-block', whiteSpace: 'pre' }}
                variants={item}
                transition={segmentTransition ?? { duration: itemDuration }}
              >
                {segment}
              </motion.span>
            </Fragment>
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
