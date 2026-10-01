import React from 'react';
import plantPaths from '../data/plant_paths.json';

export interface FlowerSketchAccentProps {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number; // 0.15 - 0.25 recommended for subtle crafted background touch
  color?: string;
  rotation?: number; // deg
  scale?: number;
  flipHorizontal?: boolean;
}

export const FlowerSketchAccent: React.FC<FlowerSketchAccentProps> = ({
  className = '',
  style = {},
  opacity = 0.20,
  color = '#4A4038',
  rotation = 0,
  scale = 1,
  flipHorizontal = false,
}) => {
  const {
    viewBox,
    mainStems,
    leafStems,
    leaves,
    flowerOpen,
    flowerBud,
  } = plantPaths as {
    viewBox: string;
    mainStems: string[];
    leafStems: string[];
    leaves: string[];
    flowerOpen: string[];
    flowerBud: string[];
  };

  const transformStyle = [
    rotation ? `rotate(${rotation}deg)` : '',
    flipHorizontal ? 'scaleX(-1)' : '',
    scale !== 1 ? `scale(${scale})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-visible ${className}`}
      style={{
        opacity,
        transform: transformStyle || undefined,
        ...style,
      }}
    >
      <svg
        viewBox={viewBox}
        className="w-full h-full overflow-visible"
        style={{
          stroke: color,
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          fill: 'none',
        }}
      >
        {/* Main Stem */}
        <g style={{ strokeWidth: 1.75 }}>
          {mainStems.map((d, i) => (
            <path key={`s-${i}`} d={d} />
          ))}
        </g>

        {/* Leaf Stems */}
        <g style={{ strokeWidth: 1.35 }}>
          {leafStems.map((d, i) => (
            <path key={`ls-${i}`} d={d} />
          ))}
        </g>

        {/* Leaves */}
        <g style={{ strokeWidth: 1.45 }}>
          {leaves.map((d, i) => (
            <path key={`l-${i}`} d={d} />
          ))}
        </g>

        {/* Open Top Flower */}
        <g style={{ strokeWidth: 1.5 }}>
          {flowerOpen.map((d, i) => (
            <path key={`fo-${i}`} d={d} />
          ))}
        </g>

        {/* Budding Lower Flower */}
        <g style={{ strokeWidth: 1.5 }}>
          {flowerBud.map((d, i) => (
            <path key={`fb-${i}`} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
};
