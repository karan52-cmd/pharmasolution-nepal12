import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Scalloped Seal (Red) */}
        <path 
          d="M50 2 A48 48 0 0 1 98 50 A48 48 0 0 1 50 98 A48 48 0 0 1 2 50 A48 48 0 0 1 50 2 Z" 
          fill="white" 
          stroke="#ef4444" 
          strokeWidth="3"
          strokeDasharray="2 2"
        />
        <circle cx="50" cy="50" r="42" stroke="#ef4444" strokeWidth="1" fill="none" />

        {/* Center Medical Symbol (Snake & Bowl - Green) */}
        <g transform="translate(30, 25) scale(0.4)">
           {/* Bowl */}
           <path d="M20 70 Q50 90 80 70 L80 60 Q50 80 20 60 Z" fill="#16a34a" />
           <path d="M50 90 V 100 M 40 100 H 60" stroke="#16a34a" strokeWidth="5" />
           
           {/* Snake */}
           <path 
             d="M50 60 Q30 60 30 40 Q30 20 50 20 Q70 20 70 40 Q70 50 60 55 L 50 60" 
             fill="none" 
             stroke="#16a34a" 
             strokeWidth="6" 
             strokeLinecap="round"
           />
           <circle cx="45" cy="25" r="3" fill="#16a34a" /> 
        </g>

        {/* Text */}
        <text x="50" y="68" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#3b82f6" fontFamily="serif">PHARMA</text>
        <text x="50" y="76" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#3b82f6" fontFamily="serif">SOLUTION</text>
        <text x="50" y="84" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#3b82f6" fontFamily="serif">NEPAL</text>
      </svg>
    </div>
  );
};

export default Logo;