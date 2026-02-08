import { WeaponType } from './types';

export const RARITY_OPTIONS = [6, 5, 4] as const;

export const WEAPON_TYPE_OPTIONS = [
  WeaponType.Sword1H,
  WeaponType.Sword2H,
  WeaponType.ArtsUnit,
  WeaponType.Spear,
  WeaponType.Pistol,
] as const;

export const BASIC_EFFECT_OPTIONS = [
  '俊敏',
  '筋力',
  '意思',
  '知性',
  'メイン能力'
] as const;

export const ADDITIONAL_EFFECT_OPTIONS = [
  '攻撃力',
  '物理ダメージ',
  '灼熱ダメージ',
  '電磁ダメージ',
  '寒冷ダメージ',
  '自然ダメージ',
  '会心率',
  'アーツ強度',
  '必殺技効率',
  'アーツダメージ',
  '回復効率'
] as const;

export const SKILL_OPTIONS = [
  '強攻',
  '圧制',
  '追襲',
  '昇揚',
  '夜幕',
  '流回',
  '治癒',
  '切骨',
  '効率'
] as const;

export const STATUS_OPTIONS = ['〇', '✖'] as const;

// Color mapping for rarities
export const RARITY_COLORS = {
  6: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  5: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  4: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
};

export const RARITY_BG_GLOW = {
  6: 'shadow-[0_0_15px_-3px_rgba(251,146,60,0.3)]',
  5: 'shadow-[0_0_15px_-3px_rgba(250,204,21,0.2)]',
  4: 'shadow-[0_0_15px_-3px_rgba(192,132,252,0.2)]',
};