import type { PenilaianItem, PenilaianScore } from '@/types/database'

export type ScoreMap = Record<string, number>

export const scoreKey = (itemId: string, studentId: string) =>
  `${itemId}:${studentId}`

export function buildScoreMap(scores: PenilaianScore[]): ScoreMap {
  const map: ScoreMap = {}
  for (const s of scores) map[scoreKey(s.item_id, s.student_id)] = Number(s.score)
  return map
}

/** Nilai -> persen dari nilai maksimal (0..100). */
export function scorePercent(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((score / max) * 100)))
}

/** Rata-rata persen sebuah siswa dari penilaian yang sudah terisi. */
export function studentAverage(
  studentId: string,
  items: PenilaianItem[],
  scores: ScoreMap
): number | null {
  const pcts: number[] = []
  for (const item of items) {
    const v = scores[scoreKey(item.id, studentId)]
    if (v !== undefined) pcts.push(scorePercent(v, item.max_score))
  }
  if (pcts.length === 0) return null
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
}

/** Rata-rata persen satu penilaian dari siswa-siswa yang diberikan. */
export function itemAverage(
  item: PenilaianItem,
  studentIds: string[],
  scores: ScoreMap
): number | null {
  const pcts: number[] = []
  for (const id of studentIds) {
    const v = scores[scoreKey(item.id, id)]
    if (v !== undefined) pcts.push(scorePercent(v, item.max_score))
  }
  if (pcts.length === 0) return null
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
}