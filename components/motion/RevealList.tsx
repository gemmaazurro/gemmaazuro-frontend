'use client';
import { Children, ReactNode } from 'react';
import RevealBlock from './RevealBlock';

/** RevealList — staggered children reveal. */
export default function RevealList({ children, stagger = 0.08 }: { children: ReactNode; stagger?: number }) {
  return <>
    {Children.map(children, (child, i) => (
      <RevealBlock key={i} delay={i * stagger}>{child}</RevealBlock>
    ))}
  </>;
}
