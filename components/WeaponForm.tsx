import React, { useState } from 'react';
import { Plus, X, Box, CheckCircle2 } from 'lucide-react';
import { Weapon, WeaponType, Rarity } from '../types';
import { 
  WEAPON_TYPE_OPTIONS, 
  RARITY_OPTIONS, 
  BASIC_EFFECT_OPTIONS, 
  ADDITIONAL_EFFECT_OPTIONS, 
  SKILL_OPTIONS 
} from '../constants';

interface WeaponFormProps {
  onAdd: (weapon: Omit<Weapon, 'id' | 'createdAt'>) => void;
}

const WeaponForm: React.FC<WeaponFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [rarity, setRarity] = useState<Rarity>(6);
  const [type, setType] = useState<WeaponType>(WeaponType.Sword1H);
  
  // Default to first options
  const [basicEffect, setBasicEffect] = useState<string>(BASIC_EFFECT_OPTIONS[0]);
  const [additionalEffect, setAdditionalEffect] = useState<string>(ADDITIONAL_EFFECT_OPTIONS[0]);
  const [skill, setSkill] = useState<string>(SKILL_OPTIONS[0]);
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPossessed, setIsPossessed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      rarity,
      type,
      basicEffect,
      additionalEffect,
      skill,
      isCompleted,
      isPossessed
    });

    // Reset fields (Keep selections for easier mass entry, just clear name and specific toggles if desired)
    setName('');
    // Optionally reset selectors to default, but often users register similar items consecutively
    // setBasicEffect(BASIC_EFFECT_OPTIONS[0]);
    // setAdditionalEffect(ADDITIONAL_EFFECT_OPTIONS[0]);
    // setSkill(SKILL_OPTIONS[0]);
    
    setIsCompleted(false);
    setIsPossessed(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-enf-yellow text-enf-black font-bold py-3 px-6 rounded-sm hover:bg-yellow-400 transition-all uppercase tracking-wider"
      >
        <Plus size={20} />
        新規登録 (Register)
      </button>
    );
  }

  return (
    <div className="bg-enf-panel border border-enf-border p-6 rounded-sm shadow-lg mb-8 relative animate-in fade-in slide-in-from-top-4 duration-300">
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-enf-muted hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold font-mono mb-6 text-enf-yellow border-l-4 border-enf-yellow pl-3 uppercase">
        基質登録 (Entry)
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Name */}
        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">武器名 (Name)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名称を入力..."
            className="w-full bg-enf-black border border-enf-border p-2 focus:border-enf-yellow focus:outline-none text-white transition-colors rounded-sm"
            required
          />
        </div>

        {/* Rarity */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">レアリティ (Rarity)</label>
          <select
            value={rarity}
            onChange={(e) => setRarity(Number(e.target.value) as Rarity)}
            className="w-full bg-enf-black border border-enf-border p-2 focus:border-enf-yellow focus:outline-none text-white rounded-sm"
          >
            {RARITY_OPTIONS.map(r => (
              <option key={r} value={r}>★ {r}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="lg:col-span-3 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">武器種 (Type)</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WeaponType)}
            className="w-full bg-enf-black border border-enf-border p-2 focus:border-enf-yellow focus:outline-none text-white rounded-sm"
          >
            {WEAPON_TYPE_OPTIONS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Statuses */}
        <div className="lg:col-span-3 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">状態設定 (Status)</label>
          <div className="flex gap-2">
             <button
                type="button"
                onClick={() => setIsPossessed(!isPossessed)}
                className={`flex-1 p-2 border rounded-sm flex items-center justify-center gap-1 transition-all ${isPossessed ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-enf-border text-enf-muted'}`}
                title="所持状況"
             >
                <Box size={16} />
                <span className="text-xs">{isPossessed ? "所持" : "未所持"}</span>
             </button>
             <button
                type="button"
                onClick={() => setIsCompleted(!isCompleted)}
                className={`flex-1 p-2 border rounded-sm flex items-center justify-center gap-1 transition-all ${isCompleted ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-enf-border text-enf-muted'}`}
                title="厳選状況"
             >
                <CheckCircle2 size={16} />
                <span className="text-xs">{isCompleted ? "完了" : "厳選中"}</span>
             </button>
          </div>
        </div>

        {/* Details Section - Now Selects */}
        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">基本効果 (Basic)</label>
          <select
            value={basicEffect}
            onChange={(e) => setBasicEffect(e.target.value)}
            className="w-full bg-enf-black border border-enf-border p-2 focus:border-enf-yellow focus:outline-none text-white rounded-sm text-sm"
          >
             {BASIC_EFFECT_OPTIONS.map(opt => (
               <option key={opt} value={opt}>{opt}</option>
             ))}
          </select>
        </div>

        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">付加効果 (Additional)</label>
          <select
            value={additionalEffect}
            onChange={(e) => setAdditionalEffect(e.target.value)}
            className="w-full bg-enf-black border border-enf-border p-2 focus:border-enf-yellow focus:outline-none text-white rounded-sm text-sm"
          >
             {ADDITIONAL_EFFECT_OPTIONS.map(opt => (
               <option key={opt} value={opt}>{opt}</option>
             ))}
          </select>
        </div>

        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-mono text-enf-muted uppercase">スキル (Skill)</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full bg-enf-black border border-enf-border p-2 focus:border-enf-yellow focus:outline-none text-white rounded-sm text-sm"
          >
             {SKILL_OPTIONS.map(opt => (
               <option key={opt} value={opt}>{opt}</option>
             ))}
          </select>
        </div>

        <div className="lg:col-span-12 flex justify-end mt-4">
           <button
            type="submit"
            className="bg-white text-black hover:bg-enf-yellow hover:text-black font-bold py-2 px-8 rounded-sm transition-colors uppercase tracking-wider"
           >
            登録 (Confirm)
           </button>
        </div>
      </form>
    </div>
  );
};

export default WeaponForm;