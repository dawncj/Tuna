
import React from 'react';
import { CHORD_DB, ChordFingering } from '../lib/chord-db';
import { getSimplifiedChord } from '../lib/chords';
import { getRelativeChord } from '../lib/chords';
import { Search, Music, ChevronRight, ArrowLeft, BookOpen, Guitar, Plus, Minus, Save, Trash2, Globe, Sparkles, Loader2, X } from 'lucide-react';

interface ChordDiagramProps {
  chordName: string;
  className?: string;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chordName, className }) => {
  React.useEffect(() => {
    setMode('original');
  }, [chordName]);
  type Mode = 'original' | 'simplified' | 'relative';
  const [mode, setMode] = React.useState<Mode>('original');

  function getValidModes(original: string): Mode[] {
    const simplified = getSimplifiedChord(original);
    const relative = getRelativeChord(original);
    const modes: Mode[] = [];

    // Always try original
    if (CHORD_DB[original]) {
      modes.push('original');
    }

    // Only add simplified if it's DIFFERENT
    if (
      simplified &&
      simplified !== original &&
      CHORD_DB[simplified]
    ) {
      modes.push('simplified');
    }

    // Only add relative if it's DIFFERENT from both
    if (
      relative &&
      relative !== original &&
      relative !== simplified &&
      CHORD_DB[relative]
    ) {
      modes.push('relative');
    }

    return modes; 
  }
  const original = chordName.trim();
  const simplified = getSimplifiedChord(original);
  const relative = getRelativeChord(original);
  const modes = getValidModes(original);
  const validModes = getValidModes(original);

  // fallback: if nothing valid, still try original
  const safeModes = validModes.length > 0 ? validModes : ['original'];

  const currentIndex = safeModes.indexOf(mode);
  const safeMode = (currentIndex === -1 ? safeModes[0] : mode) as Mode;
  const chordMap: Record<Mode, string | null> = {
    original,
    simplified,
    relative,
  };

  const displayedChord = chordMap[safeMode];

  function nextMode() {
    const modes = getValidModes(original);
    if (modes.length === 0) return;

    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;

    setMode(modes[nextIndex]);
  }

  function prevMode() {
    const modes = getValidModes(original);
    if (modes.length === 0) return;

    const currentIndex = modes.indexOf(mode);
    const prevIndex = (currentIndex - 1 + modes.length) % modes.length;

    setMode(modes[prevIndex]);
  }

  // Clean chord name for lookup (e.g., remove variations like /B if not found)
  let fingering = CHORD_DB[displayedChord];
  let effectiveMode: Mode = safeMode;

  if (!fingering && displayedChord.includes('/')) {
    const lookupName = displayedChord.split('/')[0];
    fingering = CHORD_DB[lookupName];
  }

  if (!fingering) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 rounded-lg p-4 border border-zinc-800 ${className}`}>
        <p className="text-zinc-500 text-xs text-center">Diagram not available for {chordName}</p>
      </div>
    );
  }

  const { frets, fingers, barre } = fingering;
  
  // Calculate starting fret (if all frets are high, shift view)
  const numericFrets = frets.filter((f): f is number => typeof f === 'number' && f > 0);
  const minFret = numericFrets.length > 0 ? Math.min(...numericFrets) : 0;
  const startFret = minFret > 3 ? minFret : 1;
  const numFrets = 5;

  const width = 120;
  const height = 150;
  const margin = { top: 30, right: 15, bottom: 15, left: 25 };
  
  const fretboardWidth = width - margin.left - margin.right;
  const fretboardHeight = height - margin.top - margin.bottom;
  
  const stringSpacing = fretboardWidth / 5;
  const fretSpacing = fretboardHeight / numFrets;

  return (
    <div className={`bg-zinc-900 rounded-lg p-4 border border-zinc-800 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {/* ⬅ LEFT */}
        {modes.length > 1 ? (
            <button
            onClick={prevMode}
            className="text-zinc-500 hover:text-emerald-500"
            >
            <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
        ) : (
            <div className="w-5" /> // keeps layout aligned
        )}

        {/* 🎸 CENTER */}
        <div className="flex flex-col items-center">
            <span className="font-bold text-emerald-500 text-lg">
            {displayedChord}
            </span>

            <span className="text-[10px] text-zinc-500 uppercase">
            {effectiveMode}
            </span>
        </div>

        {/* ➡ RIGHT */}
        {modes.length > 1 ? (
            <button
            onClick={nextMode}
            className="text-zinc-500 hover:text-emerald-500"
            >
            <ChevronRight className="w-5 h-5 text-zinc-700 hover:text-emerald-500 transition-colors" />
            </button>
        ) : (
            <div className="w-5" />
        )}
        </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
        {/* Nut or Fret Number */}
        {startFret === 1 ? (
          <line 
            x1={margin.left} y1={margin.top} 
            x2={width - margin.right} y2={margin.top} 
            stroke="white" strokeWidth="4" 
          />
        ) : (
          <text 
            x={margin.left - 10} y={margin.top + 15} 
            fill="white" fontSize="12" textAnchor="end"
          >
            {startFret}
          </text>
        )}

        {/* Frets */}
        {[...Array(numFrets + 1)].map((_, i) => (
          <line 
            key={`fret-${i}`}
            x1={margin.left} y1={margin.top + i * fretSpacing} 
            x2={width - margin.right} y2={margin.top + i * fretSpacing} 
            stroke="#444" strokeWidth="1" 
          />
        ))}

        {/* Strings */}
        {[...Array(6)].map((_, i) => (
          <line 
            key={`string-${i}`}
            x1={margin.left + i * stringSpacing} y1={margin.top} 
            x2={margin.left + i * stringSpacing} y2={height - margin.bottom} 
            stroke="#666" strokeWidth={1 + i * 0.2} 
          />
        ))}

        {/* Barre */}
        {barre && (
          <rect 
            x={margin.left} 
            y={margin.top + (barre - startFret) * fretSpacing + fretSpacing / 4} 
            width={fretboardWidth} 
            height={fretSpacing / 2} 
            rx="4" 
            fill="rgba(16, 185, 129, 0.4)" 
          />
        )}

        {/* Dots and X/O */}
        {frets.map((fret, stringIndex) => {
          const x = margin.left + stringIndex * stringSpacing;
          
          if (fret === 'x') {
            return (
              <text key={`xo-${stringIndex}`} x={x} y={margin.top - 10} fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">×</text>
            );
          }
          
          if (fret === 0) {
            return (
              <circle key={`xo-${stringIndex}`} cx={x} cy={margin.top - 12} r="4" fill="none" stroke="#10b981" strokeWidth="1.5" />
            );
          }

          const y = margin.top + (fret - startFret) * fretSpacing + fretSpacing / 2;
          const finger = fingers ? fingers[stringIndex] : null;

          return (
            <g key={`dot-${stringIndex}`}>
              <circle cx={x} cy={y} r="6" fill="#10b981" />
              {finger && (
                <text x={x} y={y + 4} fill="black" fontSize="10" textAnchor="middle" fontWeight="bold">{finger}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
