import React from 'react';

// Clean neutral background without heavy motion
export const RiverFlowBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none bg-[#FAF6F0] ${className}`} aria-hidden="true" />
  );
};

export const MountainSkyAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  return null;
};
