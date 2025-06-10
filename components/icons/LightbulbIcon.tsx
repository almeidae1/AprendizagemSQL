
import React from 'react';

interface IconProps {
  className?: string;
}

const LightbulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 6.75A2.25 2.25 0 0114.25 9v1.083c-.043.01-.086.02-.13.03-.394.084-.778.198-1.154.33C12.536 10.61 12.272 10.75 12 10.857c-.272-.106-.536-.247-.865-.413a10.309 10.309 0 00-1.155-.33c-.043-.01-.086-.02-.13-.03V9A2.25 2.25 0 0112 6.75z" 
    />
  </svg>
);

export default LightbulbIcon;
