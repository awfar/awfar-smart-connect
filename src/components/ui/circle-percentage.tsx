
import React from 'react';

interface CirclePercentageProps {
  percentage: number;
  color: string;
}

export const CirclePercentage: React.FC<CirclePercentageProps> = ({
  percentage,
  color
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`currentColor`}
          strokeWidth="8"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-2xl font-bold fill-current text-gray-800">
          {percentage}%
        </text>
      </svg>
    </div>
  );
};
