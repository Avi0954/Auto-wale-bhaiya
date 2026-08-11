import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

export const DriverProfile: React.FC = () => {
  const driver = usePlayerStore(state => state.driver);
  const currentMessage = usePlayerStore(state => state.currentMessage);

  if (!driver) return null;

  return (
    <div className="flex flex-col items-center text-center px-4 min-h-[5rem]">
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">{driver.name}</h2>
      {currentMessage ? (
        <p className="text-zinc-400 italic mt-1 font-serif text-lg md:text-xl transition-opacity animate-in fade-in duration-500">
          "{currentMessage}"
        </p>
      ) : (
        <p className="text-transparent mt-1 font-serif text-lg md:text-xl select-none">
          Spacer
        </p>
      )}
    </div>
  );
};
