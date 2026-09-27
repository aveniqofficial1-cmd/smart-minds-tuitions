import React from 'react';

export const SparkleDoodle = ({ className = 'w-6 h-6 text-gold-400' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
  </svg>
);

export const CurvedArrowDoodle = ({ className = 'w-16 h-12 text-gold-400' }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M10 50 C 30 10, 70 10, 85 40" />
    <path d="M75 42 L 86 42 L 88 30" />
  </svg>
);

export const UnderlineDoodle = ({ className = 'w-32 h-4 text-gold-400' }) => (
  <svg className={className} viewBox="0 0 200 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M5 12 Q 50 2, 100 12 T 195 10" />
  </svg>
);

export const CircleHighlightDoodle = ({ className = 'w-full h-full text-gold-400' }) => (
  <svg className={className} viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <ellipse cx="100" cy="40" rx="90" ry="32" strokeDasharray="3 3" />
  </svg>
);

export const GraduationCapIcon = ({ className = 'w-6 h-6 text-gold-400' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
  </svg>
);
