'use client';
import { Children, ReactNode } from 'react';
import RevealBlock from './RevealBlock';

export default function RevealList({ children, stagger = 0.1 }: {
  children: ReactNode; stagger?: number;
}) {
  return <>
    {Children.map(children, (child, i) => (
      <RevealBlock key={i} delay={i * stagger}>{child}</RevealBlock>
    ))}
  </>;
}
