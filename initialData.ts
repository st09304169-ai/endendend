
import { Weapon, WeaponType, Rarity } from './types';
import { BASIC_EFFECT_OPTIONS, ADDITIONAL_EFFECT_OPTIONS, SKILL_OPTIONS } from './constants';

// Helper to create a template weapon
const createTemplate = (
  name: string,
  rarity: Rarity,
  type: WeaponType
): Omit<Weapon, 'id' | 'createdAt'> => ({
  name,
  rarity,
  type,
  basicEffect: BASIC_EFFECT_OPTIONS[0],
  additionalEffect: ADDITIONAL_EFFECT_OPTIONS[0],
  skill: SKILL_OPTIONS[0],
  isCompleted: false, // 厳選状況: ✖
  isPossessed: false, // 所持状況: 未所持
});

export const INITIAL_WEAPONS_DATA: Omit<Weapon, 'id' | 'createdAt'>[] = [
  // --- ★6 Weapons ---
  createTemplate('統制者の剣', 6, WeaponType.Sword1H),
  createTemplate('没入する影', 6, WeaponType.Sword1H),
  createTemplate('巨人の怒り', 6, WeaponType.Sword2H),
  createTemplate('深淵の瞳', 6, WeaponType.ArtsUnit),
  createTemplate('虚空の叫び', 6, WeaponType.ArtsUnit),
  createTemplate('竜殺しの槍', 6, WeaponType.Spear),
  createTemplate('荒野の決闘', 6, WeaponType.Pistol),
  createTemplate('極光の衛士', 6, WeaponType.Sword1H),
  createTemplate('終焉の裁定', 6, WeaponType.Sword2H),

  // --- ★5 Weapons ---
  createTemplate('騎士の儀礼剣', 5, WeaponType.Sword1H),
  createTemplate('執行者の大剣', 5, WeaponType.Sword2H),
  createTemplate('貫く稲妻', 5, WeaponType.Spear),
  createTemplate('アーツワンド・改', 5, WeaponType.ArtsUnit),
  createTemplate('速射拳銃', 5, WeaponType.Pistol),
  createTemplate('守護者の盾', 5, WeaponType.Sword1H),
  createTemplate('夜明けの光', 5, WeaponType.ArtsUnit),
  createTemplate('ハンターボウ', 5, WeaponType.Pistol), // Assuming Pistol category for ranged mechanical
  createTemplate('赤熱の槍', 5, WeaponType.Spear),

  // --- ★4 Weapons ---
  createTemplate('制式片手剣', 4, WeaponType.Sword1H),
  createTemplate('強化型カトラス', 4, WeaponType.Sword1H),
  createTemplate('制式大剣', 4, WeaponType.Sword2H),
  createTemplate('重装破壊剣', 4, WeaponType.Sword2H),
  createTemplate('制式アーツユニット', 4, WeaponType.ArtsUnit),
  createTemplate('共振アーツユニット', 4, WeaponType.ArtsUnit),
  createTemplate('制式槍', 4, WeaponType.Spear),
  createTemplate('合金製の槍', 4, WeaponType.Spear),
  createTemplate('制式拳銃', 4, WeaponType.Pistol),
  createTemplate('護身用拳銃', 4, WeaponType.Pistol),
];
