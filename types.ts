export type Rarity = 4 | 5 | 6;

export enum WeaponType {
  Sword1H = '片手剣',
  Sword2H = '両手剣',
  ArtsUnit = 'アーツユニット',
  Spear = '槍',
  Pistol = '拳銃',
}

export type CompletionStatus = '〇' | '✖';

export interface Weapon {
  id: string;
  name: string;
  rarity: Rarity;
  type: WeaponType;
  basicEffect: string; 
  additionalEffect: string;
  skill: string;
  isCompleted: boolean; // True = 〇, False = ✖
  isPossessed: boolean; // True = 所持, False = 未所持
  createdAt: number;
}

export interface FilterState {
  search: string;
  rarity: Rarity[];
  type: WeaponType[];
  basicEffect: string[];
  additionalEffect: string[];
  skill: string[];
  status: CompletionStatus | 'ALL';
  possession: 'ALL' | 'YES' | 'NO';
}