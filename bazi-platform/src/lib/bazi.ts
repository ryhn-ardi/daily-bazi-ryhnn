// ── Bazi Calculation Engine ──────────────────────────
// Reference point: Oct 9 1999 = 甲午 (verified)

export const STEMS    = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

export const STEM_META = [
  ['Jiǎ','Kayu',false],['Yǐ','Kayu',true],
  ['Bǐng','Api',false],['Dīng','Api',true],
  ['Wù','Tanah',false],['Jǐ','Tanah',true],
  ['Gēng','Logam',false],['Xīn','Logam',true],
  ['Rén','Air',false],['Guǐ','Air',true],
]

export const BRANCH_META = [
  ['Zǐ','Tikus','Air'],['Chǒu','Kerbau','Tanah'],
  ['Yín','Macan','Kayu'],['Mǎo','Kelinci','Kayu'],
  ['Chén','Naga','Tanah'],['Sì','Ular','Api'],
  ['Wǔ','Kuda','Api'],['Wèi','Kambing','Tanah'],
  ['Shēn','Monyet','Logam'],['Yǒu','Ayam','Logam'],
  ['Xū','Anjing','Tanah'],['Hài','Babi','Air'],
]

const REF = new Date(1999, 9, 9) // Oct 9 1999 = 甲午

export function getDayPillar(date: Date): { si: number; bi: number } {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const days  = Math.round((local.getTime() - REF.getTime()) / 86400000)
  return {
    si: ((0 + days) % 10 + 10) % 10,
    bi: ((6 + days) % 12 + 12) % 12,
  }
}

export function getPillarString(si: number, bi: number): string {
  return `${STEMS[si]}${BRANCHES[bi]}`
}

// Kua number calculation
export function getKuaNumber(birthYear: number, gender: 'male' | 'female'): number {
  // Use year adjusted for Chinese New Year (simplified: use calendar year)
  let sum = birthYear % 100
  while (sum > 9) sum = Math.floor(sum/10) + (sum%10)
  if (gender === 'male') {
    let kua = 10 - sum
    if (kua === 5) kua = 2
    return kua
  } else {
    let kua = sum + 5
    while (kua > 9) kua = Math.floor(kua/10) + (kua%10)
    if (kua === 5) kua = 8
    return kua
  }
}

// Generate unique access code: NAME-4DIGITS
export function generateAccessCode(name: string): string {
  const prefix = name.replace(/\s+/g, '').toUpperCase().slice(0, 4)
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${digits}`
}

// Ten Gods for a given Day Master stem index
const TEN_GODS_TABLE: Record<number, string[]> = {
  0: ['比肩','劫财','食神','伤官','偏财','正财','七杀','正官','偏印','正印'],
  1: ['劫财','比肩','伤官','食神','正财','偏财','正官','七杀','正印','偏印'],
  2: ['偏印','正印','比肩','劫财','食神','伤官','偏财','正财','七杀','正官'],
  3: ['正印','偏印','劫财','比肩','伤官','食神','正财','偏财','正官','七杀'],
  4: ['七杀','正官','偏印','正印','比肩','劫财','食神','伤官','偏财','正财'],
  5: ['正官','七杀','正印','偏印','劫财','比肩','伤官','食神','正财','偏财'],
  6: ['偏财','正财','七杀','正官','偏印','正印','比肩','劫财','食神','伤官'],
  7: ['正财','偏财','正官','七杀','正印','偏印','劫财','比肩','伤官','食神'],
  8: ['食神','伤官','偏财','正财','七杀','正官','偏印','正印','比肩','劫财'],
  9: ['伤官','食神','正财','偏财','正官','七杀','正印','偏印','劫财','比肩'],
}

export function getTenGod(dayMasterSi: number, stemSi: number): string {
  return TEN_GODS_TABLE[dayMasterSi]?.[stemSi] ?? '—'
}

// Score base per stem (favorable = Fire/Earth for Wood DM, unfavorable = Water/Wood)
// This is generic — will be personalized per user's lucky elements
export const BRANCH_SCORE_MOD = [-1.5,0.5,0,1,-0.5,0.5,2,0.5,-0.5,-1,0.5,0]
