import React from 'react';
import { CheckCircle2, Box, CheckSquare } from 'lucide-react';
import { Weapon } from '../types';
import { RARITY_COLORS, RARITY_BG_GLOW } from '../constants';

interface WeaponCardProps {
  weapon: Weapon;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onTogglePossession: (id: string) => void;
}

const WeaponCard: React.FC<WeaponCardProps> = ({ 
  weapon, 
  isSelectionMode, 
  isSelected, 
  onSelect,
  onToggleStatus, 
  onTogglePossession 
}) => {
  const rarityStyle = RARITY_COLORS[weapon.rarity];
  const glowStyle = RARITY_BG_GLOW[weapon.rarity];

  // Logic for card click based on mode
  const handleCardClick = () => {
    if (isSelectionMode) {
      onSelect(weapon.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`
        relative group bg-enf-panel border rounded-sm p-3 flex flex-col h-full transition-all duration-300
        ${isSelectionMode ? 'cursor-pointer' : ''}
        ${isSelectionMode && isSelected 
            ? 'border-red-500 ring-1 ring-red-500 bg-red-900/10' 
            : `${rarityStyle} ${!isSelectionMode ? glowStyle : ''}`
        }
        ${!isSelectionMode ? 'hover:-translate-y-1 hover:shadow-lg' : ''}
        ${isSelectionMode && !isSelected ? 'opacity-60 hover:opacity-100' : ''}
      `}
    >
      
      {/* Selection Overlay Indicator */}
      {isSelectionMode && (
        <div className={`absolute top-2 right-2 z-30 transition-all ${isSelected ? 'text-red-500 scale-110' : 'text-enf-muted'}`}>
          <CheckSquare size={20} className={isSelected ? "fill-red-500/20" : ""} />
        </div>
      )}

      {/* Compact Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-0.5">
          {Array.from({ length: weapon.rarity }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-current rounded-full opacity-80" />
          ))}
        </div>
        <span className="text-[9px] font-mono tracking-wider uppercase opacity-70 border border-current px-1 rounded-sm">
          {weapon.type}
        </span>
      </div>

      {/* Main Name */}
      <h3 className="text-sm font-bold text-white mb-3 truncate leading-tight" title={weapon.name}>
        {weapon.name}
      </h3>

      {/* Stats - Always Visible */}
      <div className={`bg-enf-black/40 border border-white/5 rounded-sm p-2 mb-3 flex-grow ${isSelectionMode ? 'pointer-events-none' : ''}`}>
         <div className="space-y-2">
            <div>
              <span className="text-[9px] text-enf-muted block uppercase tracking-wider">BASIC</span>
              <span className="text-[11px] text-enf-yellow block truncate" title={weapon.basicEffect}>{weapon.basicEffect || '-'}</span>
            </div>
            <div>
              <span className="text-[9px] text-enf-muted block uppercase tracking-wider">ADDITIONAL</span>
              <span className="text-[11px] text-white block truncate" title={weapon.additionalEffect}>{weapon.additionalEffect || '-'}</span>
            </div>
            <div>
              <span className="text-[9px] text-enf-muted block uppercase tracking-wider">SKILL</span>
              <span className="text-[11px] text-white block truncate" title={weapon.skill}>{weapon.skill || '-'}</span>
            </div>
         </div>
      </div>

      {/* Bottom Actions Row - Hidden in Selection Mode */}
      {!isSelectionMode && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 mt-auto relative z-20">
          
          {/* Toggles - Full Width when no delete button */}
          <div className="flex items-center gap-1.5 w-full">
              {/* Possession Toggle */}
              <button
                  type="button"
                  onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      onTogglePossession(weapon.id); 
                  }}
                  className={`flex-1 flex justify-center items-center p-1.5 rounded-sm transition-colors cursor-pointer ${
                      weapon.isPossessed 
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                      : 'bg-enf-black text-enf-muted hover:text-white border border-enf-border'
                  }`}
                  title={weapon.isPossessed ? "所持済み" : "未所持"}
              >
                  <Box size={14} />
              </button>

              {/* Completion Toggle */}
              <button
                  type="button"
                  onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      onToggleStatus(weapon.id); 
                  }}
                  className={`flex-1 flex justify-center items-center p-1.5 rounded-sm transition-colors cursor-pointer ${
                      weapon.isCompleted 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                      : 'bg-enf-black text-enf-muted hover:text-white border border-enf-border'
                  }`}
                  title={weapon.isCompleted ? "厳選完了" : "厳選中"}
              >
                  <CheckCircle2 size={14} />
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeaponCard;