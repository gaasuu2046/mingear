export const SEASONS = [
  { ja: '春', en: 'SPRING' },
  { ja: '夏', en: 'SUMMER' },
  { ja: '秋', en: 'AUTUMN' },
  { ja: '冬', en: 'WINTER' },
  { ja: '未設定', en: 'UNSPECIFIED' },
] as const;

export type Season = typeof SEASONS[number]['en'];
