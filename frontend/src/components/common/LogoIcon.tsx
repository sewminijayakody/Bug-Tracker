import React from 'react';

interface LogoIconProps {
  size?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ size = 52 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="256" cy="130" r="50" fill="#2d3436" />
      
      {/* Left antenna */}
      <line x1="220" y1="90" x2="180" y2="40" stroke="#2d3436" strokeWidth="20" strokeLinecap="round" />
      <circle cx="180" cy="40" r="18" fill="#2d3436" />
      
      {/* Right antenna */}
      <line x1="292" y1="90" x2="332" y2="40" stroke="#2d3436" strokeWidth="20" strokeLinecap="round" />
      <circle cx="332" cy="40" r="18" fill="#2d3436" />
      
      {/* Left wing */}
      <ellipse cx="180" cy="280" rx="70" ry="120" fill="#ff5252" />
      
      {/* Right wing */}
      <ellipse cx="332" cy="280" rx="70" ry="120" fill="#ff5252" />
      
      {/* Center divider */}
      <rect x="246" y="180" width="20" height="200" fill="#2d3436" />
      
      {/* Left spots */}
      <circle cx="170" cy="240" r="18" fill="#2d3436" />
      <circle cx="170" cy="320" r="18" fill="#2d3436" />
      
      {/* Right spots */}
      <circle cx="342" cy="240" r="18" fill="#2d3436" />
      <circle cx="342" cy="320" r="18" fill="#2d3436" />
      
      {/* Left leg 1 */}
      <line x1="140" y1="240" x2="80" y2="200" stroke="#2d3436" strokeWidth="18" strokeLinecap="round" />
      
      {/* Left leg 2 */}
      <line x1="140" y1="300" x2="80" y2="340" stroke="#2d3436" strokeWidth="18" strokeLinecap="round" />
      
      {/* Left leg 3 */}
      <line x1="140" y1="360" x2="80" y2="400" stroke="#2d3436" strokeWidth="18" strokeLinecap="round" />
      
      {/* Right leg 1 */}
      <line x1="372" y1="240" x2="432" y2="200" stroke="#2d3436" strokeWidth="18" strokeLinecap="round" />
      
      {/* Right leg 2 */}
      <line x1="372" y1="300" x2="432" y2="340" stroke="#2d3436" strokeWidth="18" strokeLinecap="round" />
      
      {/* Right leg 3 */}
      <line x1="372" y1="360" x2="432" y2="400" stroke="#2d3436" strokeWidth="18" strokeLinecap="round" />
    </svg>
  );
};
