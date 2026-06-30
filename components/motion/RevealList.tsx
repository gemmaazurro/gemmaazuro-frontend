'use client';
import { Children, ReactNode, CSSProperties } from 'react';
import RevealBlock from './RevealBlock';

/** RevealList — staggered children reveal. */
interface RevealListProps {
  children: ReactNode;
  stagger?: number;
  wrapStyle?: CSSProperties;
}

export default function RevealList({ children, stagger = 0.08, wrapStyle }: RevealListProps) {
  const items = Children.toArray(children);
  return <>
    {items.map((child, i) => (
      <RevealBlock key={i} delay={i * stagger} style={wrapStyle}>{child}</RevealBlock>
    ))}
  </>;
}
