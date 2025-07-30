import React from 'react';

const EmptyStateIcon = () => (
  <div className="relative">
    <svg width="120" height="80" viewBox="0 0 120 80" className="text-gray-300">
      <rect x="30" y="20" width="60" height="35" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="32" y="22" width="56" height="28" rx="1" fill="white" />
      <path d="M40 35 L45 30 L50 38 L55 25 L60 32 L65 28 L70 35 L75 30 L80 40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="45" y="55" width="30" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <ellipse cx="60" cy="65" rx="15" ry="3" fill="currentColor" opacity="0.2" />
      <circle cx="20" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <circle cx="100" cy="45" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M28 30 L30 25" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M94 45 L90 50" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M100 39 L105 35" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  </div>
);

export default EmptyStateIcon;
