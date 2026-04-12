import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trendText: string;
  trendType: "up" | "down" | "neutral" | "warning";
  trendIcon: string;
  colorClass: "primary" | "secondary" | "tertiary" | "secondary-container";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trendText, trendType, trendIcon, colorClass }) => {
  const colorMap = {
    "primary": "bg-primary-fixed/30 text-primary",
    "secondary": "bg-secondary-fixed/30 text-secondary",
    "tertiary": "bg-tertiary-fixed/30 text-tertiary",
    "secondary-container": "bg-secondary-container/20 text-on-secondary-container"
  };

  const trendColorMap = {
    "up": "text-green-600",
    "down": "text-green-600", 
    "neutral": "text-on-surface-variant",
    "warning": "text-red-500"
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] ambient-shadow flex flex-col justify-between border border-outline-variant/10">
      <div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[colorClass]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-extrabold mt-2 font-manrope">{value}</h3>
      </div>
      <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${trendColorMap[trendType]}`}>
        <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        <span>{trendText}</span>
      </div>
    </div>
  );
};

export default StatCard;
