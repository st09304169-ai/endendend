import React, { useState, useRef, useEffect } from 'react';
import { FilterState, Rarity, WeaponType } from '../types';
import { 
  RARITY_OPTIONS, 
  WEAPON_TYPE_OPTIONS, 
  BASIC_EFFECT_OPTIONS, 
  ADDITIONAL_EFFECT_OPTIONS, 
  SKILL_OPTIONS 
} from '../constants';
import { Search, ChevronDown, Check, RefreshCcw } from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, totalCount }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const toggleFilterArray = (key: keyof FilterState, value: any) => {
    setFilter(prev => {
      const currentArray = prev[key] as any[];
      const exists = currentArray.includes(value);
      return {
        ...prev,
        [key]: exists ? currentArray.filter(x => x !== value) : [...currentArray, value]
      };
    });
  };

  const resetFilters = () => {
    setFilter({
      search: '',
      rarity: [],
      type: [],
      basicEffect: [],
      additionalEffect: [],
      skill: [],
      status: 'ALL',
      possession: 'ALL'
    });
    setOpenDropdown(null);
  };

  const renderDropdownButton = (
    label: string, 
    key: keyof FilterState, 
    options: readonly any[], 
    widthClass: string = 'w-48'
  ) => {
    const selectedCount = (filter[key] as any[]).length;
    const isActive = selectedCount > 0;

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(key as string)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono border rounded-sm transition-colors whitespace-nowrap ${
            isActive
              ? 'bg-white/10 border-white text-white'
              : 'bg-enf-black border-enf-border text-enf-muted hover:border-gray-500'
          }`}
        >
          {label} {isActive && `(${selectedCount})`}
          <ChevronDown size={12} className={`transition-transform ${openDropdown === key ? 'rotate-180' : ''}`} />
        </button>

        {openDropdown === key && (
          <div className={`absolute top-full mt-1 left-0 ${widthClass} bg-enf-panel border border-enf-border shadow-xl rounded-sm p-1 z-40 max-h-60 overflow-y-auto`}>
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => toggleFilterArray(key, opt)}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-enf-border rounded-sm flex items-center justify-between"
              >
                <span className="truncate mr-2">{opt}</span>
                {(filter[key] as any[]).includes(opt) && <Check size={12} className="text-white flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-enf-dark border-b border-enf-border sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4" ref={dropdownRef}>
        
        {/* Top Row: Search & Statuses */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-enf-muted group-focus-within:text-enf-yellow transition-colors" size={16} />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search Name..."
              className="w-full bg-enf-black border border-enf-border rounded-sm py-1.5 pl-9 pr-4 text-sm focus:border-enf-yellow focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
             {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('status')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono border rounded-sm transition-colors whitespace-nowrap ${
                  filter.status !== 'ALL' 
                    ? 'bg-green-500/10 border-green-500 text-green-400' 
                    : 'bg-enf-black border-enf-border text-enf-muted hover:border-gray-500'
                }`}
              >
                GEN-SEN: {filter.status}
                <ChevronDown size={12} className={`transition-transform ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'status' && (
                <div className="absolute top-full mt-1 right-0 w-32 bg-enf-panel border border-enf-border shadow-xl rounded-sm p-1 z-40">
                  <button onClick={() => { setFilter(prev => ({...prev, status: 'ALL'})); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs rounded-sm ${filter.status === 'ALL' ? 'text-enf-yellow' : 'text-gray-300 hover:bg-enf-border'}`}>ALL</button>
                  <button onClick={() => { setFilter(prev => ({...prev, status: '〇'})); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs rounded-sm ${filter.status === '〇' ? 'text-green-400' : 'text-gray-300 hover:bg-enf-border'}`}>Completed (〇)</button>
                  <button onClick={() => { setFilter(prev => ({...prev, status: '✖'})); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs rounded-sm ${filter.status === '✖' ? 'text-red-400' : 'text-gray-300 hover:bg-enf-border'}`}>Pending (✖)</button>
                </div>
              )}
            </div>

            {/* Possession Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('possession')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono border rounded-sm transition-colors whitespace-nowrap ${
                  filter.possession !== 'ALL' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-enf-black border-enf-border text-enf-muted hover:border-gray-500'
                }`}
              >
                POSSESSION: {filter.possession}
                <ChevronDown size={12} className={`transition-transform ${openDropdown === 'possession' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'possession' && (
                <div className="absolute top-full mt-1 right-0 w-36 bg-enf-panel border border-enf-border shadow-xl rounded-sm p-1 z-40">
                  <button onClick={() => { setFilter(prev => ({...prev, possession: 'ALL'})); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs rounded-sm ${filter.possession === 'ALL' ? 'text-enf-yellow' : 'text-gray-300 hover:bg-enf-border'}`}>ALL</button>
                  <button onClick={() => { setFilter(prev => ({...prev, possession: 'YES'})); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs rounded-sm ${filter.possession === 'YES' ? 'text-blue-400' : 'text-gray-300 hover:bg-enf-border'}`}>Possessed (YES)</button>
                  <button onClick={() => { setFilter(prev => ({...prev, possession: 'NO'})); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs rounded-sm ${filter.possession === 'NO' ? 'text-gray-400' : 'text-gray-300 hover:bg-enf-border'}`}>Missing (NO)</button>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-enf-border mx-1 hidden md:block"></div>
            
            <button 
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-enf-muted hover:text-enf-yellow transition-colors whitespace-nowrap px-2"
              title="Reset Filters"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Attribute Filters */}
        <div className="flex flex-wrap items-center gap-2">
           {renderDropdownButton('RARITY', 'rarity', RARITY_OPTIONS, 'w-32')}
           {renderDropdownButton('TYPE', 'type', WEAPON_TYPE_OPTIONS, 'w-48')}
           <div className="h-4 w-px bg-enf-border mx-1"></div>
           {renderDropdownButton('BASIC', 'basicEffect', BASIC_EFFECT_OPTIONS, 'w-40')}
           {renderDropdownButton('ADDITIONAL', 'additionalEffect', ADDITIONAL_EFFECT_OPTIONS, 'w-48')}
           {renderDropdownButton('SKILL', 'skill', SKILL_OPTIONS, 'w-32')}
        </div>

      </div>
    </div>
  );
};

export default FilterBar;