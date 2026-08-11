import React from 'react';

interface MeterProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export const Meter: React.FC<MeterProps> = ({ label, value, highlight = false }) => {
  return (
    <div className="bg-zinc-900 border-2 border-zinc-700 rounded-md p-3 flex flex-col items-center justify-center min-w-[100px] shadow-inner">
      <span className="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-mono font-bold ${highlight ? 'text-auto-green' : 'text-auto-yellow'}`}>
        {value}
      </span>
    </div>
  );
};
