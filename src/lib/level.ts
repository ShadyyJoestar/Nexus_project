export type LevelTone = 'emerald' | 'sky' | 'amber' | 'rose'

/** Batas persen untuk tiap level warna (dipakai kehadiran & penilaian). */
export const LOW_LEVEL = 75

export function levelTone(pct: number): LevelTone {
  if (pct >= 85) return 'emerald'
  if (pct >= LOW_LEVEL) return 'sky'
  if (pct >= 60) return 'amber'
  return 'rose'
}

export const LEVEL_CLASSES: Record<
  LevelTone,
  { bar: string; chip: string }
> = {
  emerald: {
    bar: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900',
  },
  sky: {
    bar: 'bg-sky-500',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-900',
  },
  amber: {
    bar: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900',
  },
  rose: {
    bar: 'bg-rose-500',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900',
  },
}   