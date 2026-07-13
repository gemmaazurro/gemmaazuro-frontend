import React, { FC, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const createIcon = (paths: string[], viewBox = "0 0 24 24"): FC<IconProps> => {
  const Icon: FC<IconProps> = ({ size = 22, strokeWidth = 1.5, ...props }) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
  Icon.displayName = 'Icon';
  return Icon;
};

export const Search = createIcon(['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.3-4.3']);
export const Heart = createIcon(['M12 21s-7-4.5-9.5-9C1 8.5 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 3.5 3.5 7-2.5 4.5-9.5 9-9.5 9z']);
export const Bag = createIcon(['M6 8h12l-1 12H7L6 8z', 'M9 8V6a3 3 0 0 1 6 0v2']);
export const User = createIcon(['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M5 20a7 7 0 0 1 14 0']);
export const Menu = createIcon(['M3 6h18', 'M3 12h18', 'M3 18h18']);
export const Close = createIcon(['M6 6l12 12', 'M18 6L6 18']);
export const ChevronRight = createIcon(['M9 6l6 6-6 6']);
export const ChevronDown = createIcon(['M6 9l6 6 6-6']);
export const ArrowRight = createIcon(['M5 12h14', 'M13 6l6 6-6 6']);
export const Truck = createIcon(['M3 7h11v8H3z', 'M14 10h4l3 3v2h-7z', 'M7.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z']);
export const Shield = createIcon(['M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z', 'M8.5 12l2.3 2.3 4.7-4.8']);
export const Instagram = createIcon(['M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M17.5 6.5h.01']);
export const Pin = createIcon(['M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z', 'M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z']);
export const Phone = createIcon(['M5 4h3l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']);
export const Clock = createIcon(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2']);
export const Sun = createIcon(['M12 4V2', 'M12 22v-2', 'M4.93 4.93l1.41 1.41', 'M17.66 17.66l1.41 1.41',
  'M2 12h2', 'M20 12h2', 'M4.93 19.07l1.41-1.41', 'M17.66 6.34l1.41-1.41', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z']);
export const Moon = createIcon(['M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z']);

export const TikTok: FC<IconProps> = ({ size = 22, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 3c.3 2.1 1.6 3.7 3.7 4v2.4c-1.3.1-2.6-.3-3.7-1v6.1A5.5 5.5 0 1 1 10.5 9v2.5a3 3 0 1 0 2.5 3V3h3z" />
  </svg>
);

export const WhatsApp: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.3-.5c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 00-.7.3c-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.3z" />
  </svg>
);
