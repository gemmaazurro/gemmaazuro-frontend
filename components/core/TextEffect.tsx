import React, { CSSProperties, ElementType } from 'react';

/**
 * Animated text reveal — staggered per-character or per-word entrance.
 * Presets: 'fade' | 'slide-up' | 'blur'
 *
 * @example
 * <TextEffect per="char" preset="fade">Gemma Azzurro</TextEffect>
 * <TextEffect per="word" preset="slide-up" delay={0.2}>Pioneering lab diamonds.</TextEffect>
 */
interface TextEffectProps {
  children: string;
  per?: 'char' | 'word';
  preset?: 'fade' | 'slide-up' | 'blur';
  delay?: number;
  stagger?: number;
  as?: ElementType;
  style?: CSSProperties;
  className?: string;
}

export default function TextEffect({
  children,
  per = 'word',
  preset = 'fade',
  delay = 0,
  stagger = 0.045,
  as: Tag = 'span',
  style,
  ...rest
}: TextEffectProps) {
  const text = typeof children === 'string' ? children : '';
  const units = per === 'char' ? [...text] : text.split(' ');

  const getStyle = (i: number): CSSProperties => {
    const d = (delay + i * stagger).toFixed(3);
    if (preset === 'fade') {
      return {
        display: 'inline-block',
        animation: `ga-fade-in 0.45s ease ${d}s both`,
      };
    }
    if (preset === 'slide-up') {
      return {
        display: 'inline-block',
        verticalAlign: 'bottom',
        animation: `ga-appear-up 0.5s cubic-bezier(0.075,0.82,0.165,1) ${d}s both`,
      };
    }
    if (preset === 'blur') {
      return {
        display: 'inline-block',
        animation: `ga-blur-in 0.48s ease ${d}s both`,
      };
    }
    return { display: 'inline-block' };
  };

  return (
    <Tag style={{ display: 'inline', ...style }} {...rest}>
      {units.map((unit, i) => (
        <React.Fragment key={i}>
          <span style={getStyle(i)}>
            {per === 'char' && unit === ' ' ? '\u00a0' : unit}
          </span>
          {per === 'word' && i < units.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
