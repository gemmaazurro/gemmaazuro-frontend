'use client';
import { CSSProperties, ElementType } from 'react';

/** SplitWords — hero heading stagger with per-word animation. */
interface SplitWordsProps {
  text: string;
  tag?: ElementType;
  baseDelay?: number;
  style?: CSSProperties;
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function SplitWords({ text, tag: Tag = 'h1' as ElementType, baseDelay = 0, style }: SplitWordsProps) {
  const words = text.split(' ');
  return (
    <Tag style={{ margin: 0, ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em', verticalAlign: 'bottom' }}>
          <span style={{
            display: 'inline-block',
            animation: prefersReduced() ? 'none' : `ga-appear-up 0.6s cubic-bezier(0.075,0.82,0.165,1) ${baseDelay + i * 0.07}s both`,
          }}>{word}</span>
        </span>
      ))}
    </Tag>
  );
}
