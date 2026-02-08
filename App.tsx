import React, { useState, useEffect, useMemo } from 'react';
import { Weapon, FilterState } from './types';
import WeaponForm from './components/WeaponForm';
import WeaponCard from './components/WeaponCard';
import FilterBar from './components/FilterBar';
import { INITIAL_WEAPONS_DATA } from './initialData';
import { Hexagon, Database, Trash2, X, CheckSquare, AlertTriangle } from 'lucide-react';
import { generateId } from './utils';

const App: React.FC = () => {
  // --- State ---
  const [weapons, setWeapons] = useState<Weapon[]>(() => {
    const saved = localStorage.getItem('endfield_weapons');
    
    // Check if we have saved data
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate existing data to ensure all fields exist
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((w: any) => ({
              ...w,
              // Ensure ID exists and is a string. If missing, generate new one.
              id: w.id ? String(w.id) : generateId(), 
              isPossessed: w.isPossessed ?? true,
              basicEffect: w.basicEffect || '',
              additionalEffect: w.additionalEffect || '',
              skill: w.skill || ''
          }));
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }

    // If no data (or empty array), load Initial Data
    return INITIAL_WEAPONS_DATA.map(w => ({
      ...w,
      id: generateId(),
      createdAt: Date.now()
    }));
  });

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    rarity: [],
    type: [],
    basicEffect: [],
    additionalEffect: [],
    skill: [],
    status: 'ALL',
    possession: 'ALL'
  });

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('endfield_weapons', JSON.stringify(weapons));
  }, [weapons]);

  // --- Handlers ---
  const handleAddWeapon = (newWeapon: Omit<Weapon, 'id' | 'createdAt'>) => {
    const weapon: Weapon = {
      ...newWeapon,
      id: generateId(),
      createdAt: Date.now()
    };
    setWeapons(prev => [weapon, ...prev]);
  };

  const handleToggleStatus = (id: string) => {
    if (isSelectionMode) return; // Disable toggles in selection mode
    setWeapons(prev => prev.map(w => 
      w.id === id ? { ...w, isCompleted: !w.isCompleted } : w
    ));
  };

  const handleTogglePossession = (id: string) => {
    if (isSelectionMode) return; // Disable toggles in selection mode
    setWeapons(prev => prev.map(w => 
      w.id === id ? { ...w, isPossessed: !w.isPossessed } : w
    ));
  };

  // Bulk Delete Handlers
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set()); // Reset selection when toggling
    setShowDeleteModal(false);
  };

  const handleSelectWeapon = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const initiateBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setShowDeleteModal(true);
  };

  const confirmBulkDelete = () => {
    setWeapons(prev => prev.filter(w => !selectedIds.has(w.id)));
    setIsSelectionMode(false);
    setSelectedIds(new Set());
    setShowDeleteModal(false);
  };

  // --- Filtering Logic ---
  const filteredWeapons = useMemo(() => {
    return weapons.filter(w => {
      // Search
      if (filter.search && !w.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      
      // Multi-select filters
      if (filter.rarity.length > 0 && !filter.rarity.includes(w.rarity)) return false;
      if (filter.type.length > 0 && !filter.type.includes(w.type)) return false;
      
      if (filter.basicEffect.length > 0 && !filter.basicEffect.includes(w.basicEffect)) return false;
      if (filter.additionalEffect.length > 0 && !filter.additionalEffect.includes(w.additionalEffect)) return false;
      if (filter.skill.length > 0 && !filter.skill.includes(w.skill)) return false;

      // Status (Gen-sen)
      if (filter.status === '〇' && !w.isCompleted) return false;
      if (filter.status === '✖' && w.isCompleted) return false;

      // Possession
      if (filter.possession === 'YES' && !w.isPossessed) return false;
      if (filter.possession === 'NO' && w.isPossessed) return false;

      return true;
    });
  }, [weapons, filter]);

  const stats = useMemo(() => {
    const total = filteredWeapons.length;
    const completed = filteredWeapons.filter(w => w.isCompleted).length;
    const possessed = filteredWeapons.filter(w => w.isPossessed).length;
    
    // Gen-sen rate (Completed / Possessed)
    const gensenRate = possessed === 0 ? 0 : Math.round((completed / possessed) * 100);
    
    // Collection rate (Possessed / Total Visible)
    const collectionRate = total === 0 ? 0 : Math.round((possessed / total) * 100);

    return { total, completed, possessed, gensenRate, collectionRate };
  }, [filteredWeapons]);

  return (
    <div className="min-h-screen bg-enf-black text-enf-text font-sans flex flex-col relative">
      
      {/* Header */}
      <header className="bg-enf-dark border-b border-enf-border py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-enf-yellow text-black flex items-center justify-center rounded-sm clip-path-hex">
                <Hexagon size={24} strokeWidth={2.5} />
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-tighter uppercase font-mono">Endfield <span className="text-enf-yellow">Substrate</span></h1>
               <div className="text-[10px] text-enf-muted tracking-widest uppercase">Operational Analytics</div>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
             <div className="flex flex-col items-end">
                <span className="text-enf-muted uppercase">Total Registered</span>
                <span className="text-lg font-bold text-white">{weapons.length}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        
        {/* Filter Bar */}
        <FilterBar filter={filter} setFilter={setFilter} totalCount={filteredWeapons.length} />

        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          
          {/* Add Form - Hide in selection mode to avoid clutter */}
          {!isSelectionMode && (
            <div className="mb-8">
              <WeaponForm onAdd={handleAddWeapon} />
            </div>
          )}

          {/* Stats Summary & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-enf-border/50 text-xs md:text-sm font-mono sticky top-16 z-20 bg-enf-black/90 backdrop-blur py-2">
             
             {/* Left: Stats */}
             <div className="flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2 text-enf-yellow">
                  <Database size={16} />
                  <span className="font-bold">SUMMARY</span>
               </div>
               
               <div className="h-4 w-px bg-enf-border hidden sm:block"></div>

               <div className="hidden sm:block">
                  <span className="text-enf-muted mr-1">HITS:</span>
                  <span className="text-white">{stats.total}</span>
               </div>
             </div>

             {/* Right: Selection/Delete Controls */}
             <div>
                {isSelectionMode ? (
                  <div className="flex items-center gap-2">
                    <span className="text-enf-yellow font-bold mr-2 animate-pulse">
                      DELETE MODE ({selectedIds.size})
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); initiateBulkDelete(); }}
                      disabled={selectedIds.size === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-sm font-bold uppercase transition-all ${
                        selectedIds.size > 0 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)]' 
                        : 'bg-enf-panel text-enf-muted cursor-not-allowed border border-enf-border'
                      }`}
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete Selected</span>
                    </button>
                    <button 
                      type="button"
                      onClick={toggleSelectionMode}
                      className="flex items-center gap-2 px-4 py-2 bg-enf-panel border border-enf-border text-white rounded-sm hover:bg-enf-border transition-colors uppercase"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={toggleSelectionMode}
                    className="flex items-center gap-2 px-4 py-2 bg-enf-panel border border-enf-border text-enf-muted hover:text-white hover:border-enf-yellow hover:bg-enf-yellow/10 rounded-sm transition-all uppercase"
                  >
                    <CheckSquare size={16} />
                    Edit / Delete
                  </button>
                )}
             </div>
          </div>

          {/* Grid List */}
          {filteredWeapons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-enf-muted border-2 border-dashed border-enf-border rounded-sm">
              <Hexagon className="mb-4 opacity-20" size={64} />
              <p className="font-mono uppercase tracking-widest">No Data Found</p>
              <p className="text-sm mt-2">基質データを登録するか、検索条件を変更してください。</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {filteredWeapons.map(weapon => (
                <WeaponCard 
                  key={weapon.id} 
                  weapon={weapon} 
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedIds.has(weapon.id)}
                  onSelect={handleSelectWeapon}
                  onToggleStatus={handleToggleStatus}
                  onTogglePossession={handleTogglePossession}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-enf-panel border border-red-500/50 p-6 rounded-sm max-w-sm w-full shadow-[0_0_30px_-5px_rgba(220,38,38,0.3)] animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4 text-red-500">
                 <AlertTriangle size={24} />
                 <h3 className="text-xl font-bold uppercase tracking-wider">Warning</h3>
              </div>
              
              <p className="text-gray-300 mb-6 font-mono text-sm leading-relaxed">
                 選択した <span className="text-white font-bold bg-red-500/20 px-1 rounded">{selectedIds.size}</span> 個の武器データを<br/>完全に削除しますか？<br/>
                 <span className="text-xs text-enf-muted mt-2 block opacity-70">※ この操作は取り消せません。</span>
              </p>

              <div className="flex justify-end gap-3">
                 <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-sm border border-enf-border text-gray-400 hover:text-white hover:bg-enf-border transition-colors text-xs uppercase tracking-wider"
                 >
                    Cancel
                 </button>
                 <button
                    onClick={confirmBulkDelete}
                    className="px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors text-xs uppercase tracking-wider font-bold shadow-lg"
                 >
                    Execute Delete
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-enf-dark border-t border-enf-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-[10px] text-enf-muted font-mono uppercase">
             Endfield Substrate Tracker // Prototype Ver 1.4
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;