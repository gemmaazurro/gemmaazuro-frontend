'use client';
import { CSSProperties, ElementType } from 'react';

export default function SplitWords({ text, tag: Tag = 'p' as ElementType, baseDelay = 0, style }: {
  text: string; tag?: ElementType; baseDelay?: number; style?: CSSProperties;
}) {
  const words = text.split(' ');
  return (
    <Tag style={style}>
      {words.map((word: string, i: number) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
          <span style={{
            display: 'inline-block',
            animation: `ga-appear-up 0.5s cubic-bezier(0.075,0.82,0.165,1) ${baseDelay + i * 0.07}s both`,
          }}>{word}</span>
        </span>
      ))}
    </Tag>
  );
}
