import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-auto text-primary" }: LogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 240 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ícone M-Bolt */}
      <path d="M5 45V15L15 30L25 5V35L15 20L5 45Z" fill="currentColor" />
      <path 
        d="M18 10L14 35H22L18 50L26 25H18L22 10H18Z" 
        fill="currentColor" 
        stroke="#070612" 
        strokeWidth="1.5" 
      />

      {/* Texto Principal: MultiPost */}
      <text 
        x="45" 
        y="32" 
        fill="currentColor" 
        style={{ 
          fontFamily: "'Barlow', sans-serif", 
          fontWeight: 700, 
          fontSize: '26px', 
          letterSpacing: '-0.01em' 
        }}
      >
        MultiPost
      </text>
      
      {/* Subtexto: AUTOMATION SOLUTIONS */}
      <text 
        x="45" 
        y="48" 
        fill="currentColor" 
        opacity="0.6" 
        style={{ 
          fontFamily: "'Barlow', sans-serif", 
          fontWeight: 400, 
          fontSize: '10px', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase' 
        }}
      >
        AUTOMATION SOLUTIONS
      </text>
    </svg>
  );
}
