'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PenilaianItem, PenilaianScore } from '@/types/database'
import { Avatar, Card, PrimaryButton, StatCard } from '@/components/ui'
import {
  buildScoreMap,
  itemAverage,
  scoreKey,
  scorePercent,
  studentAverage,
  type ScoreMap,
} from '@/lib/penilaian'
import { LEVEL_CLASSES, levelTone } from '@/lib/level'

type Student = { id: string; name: string }

type Props = {
  /** hanya siswa aktif */
  students: Student[]
  items: PenilaianItem[]
  scores: PenilaianScore[]
}

const inputClass =
  'w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

function AvgChip({ value }: { value: number | null }) {
  if (value === null) return <span className="text-slate-400">-</span>
  return (
    <span
      className={`inline-flex min-w-[3rem] justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset ${LEVEL_CLASSES[levelTone(value)].chip}`}
    >
      {value}
    </span>
  )
}

export default function PenilaianPanel({
  students,
  items: initialItems,
  scores: initialScores,
}: Props) {
  const [items, setItems] = useState(initialItems)
  const [scores, setScores] = useState<ScoreMap>(() => buildScoreMap(initialScores))

  const [newTitle, setNewTitle] = useState('')
  const [newMax, setNewMax] = useState('100')
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const studentIds = students.map((s) => s.id)
  const rows = students.map((s) => ({
    ...s,
    avg: studentAverage(s.id, items, scores),
  }))
  const graded = rows.filter((r) => r.avg !== null)
  const classAvg =
    graded.length === 0
      ? null
      : Math.round(graded.reduce((sum, r) => sum + (r.avg ?? 0), 0) / graded.length)
  const top = graded.reduce<(typeof graded)[number] | null>(
    (best, r) => (best === null || (r.avg ?? 0) > (best.avg ?? 0) ? r : best),
    null
  )
  const filledCells = items.reduce(
    (sum, item) =>
      sum + studentIds.filter((id) => scores[scoreKey(item.id, id)] !== undefined).length,
    0
  )
  const emptyCells = students.length * items.length - filledCells

  function fail(text: string, key: string | null = null) {
    setErrorKey(key)
    setMessage({ text, ok: false })
  }

  async function saveScore(item: PenilaianItem, student: Student, raw: string) {
    const key = scoreKey(item.id, student.id)
    const text = raw.trim().replace(',', '.')
    const previous = scores[key]
    setErrorKey(null)
    setMessage(null)
    const supabase = createClient()

    if (text === '') {
      if (previous === undefined) return
      const { error } = await supabase
        .from('penilaian_scores')
        .delete()
        .eq('item_id', item.id)
        .eq('student_id', student.id)
      if (error) return fail('Gagal menghapus nilai.', key)
      setScores((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      return
    }

    const value = Math.round(Number(text) * 100) / 100
    if (!Number.isFinite(value) || value < 0 || value > item.max_score) {
      return fail(`Nilai ${student.name} harus 0–${item.max_score}.`, key)
    }
    if (value === previous) return

    const { error } = await supabase
      .from('penilaian_scores')
      .upsert(
        { item_id: item.id, student_id: student.id, score: value },
        { onConflict: 'item_id,student_id' }
      )
    if (error) return fail('Gagal menyimpan nilai.', key)
    setScores((prev) => ({ ...prev, [key]: value }))
  }

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const title = newTitle.trim()
    const max = Number(newMax.replace(',', '.'))
    if (title.length < 1 || title.length > 80) {
      return fail('Nama penilaian 1–80 karakter.')
    }
    if (!Number.isFinite(max) || max <= 0 || max > 1000) {
      return fail('Nilai maksimal harus antara 1 dan 1000.')
    }

    setAdding(true)
    setMessage(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('penilaian_items')
      .insert({ title, max_score: max })
      .select('id, title, max_score, created_at')
      .single()
    setAdding(false)

    if (error || !data) {
      return fail(
        error?.code === '23505'
          ? 'Sudah ada penilaian dengan nama itu.'
          : 'Gagal menambah penilaian.'
      )
    }
    setItems((prev) => [...prev, { ...(data as PenilaianItem), max_score: Number(data.max_score) }])
    setNewTitle('')
    setMessage({ text: `Penilaian "${title}" ditambahkan.`, ok: true })
  }

  async function deleteItem(item: PenilaianItem) {
    const ok = window.confirm(
      `Hapus penilaian "${item.title}"?\nSemua nilai siswa untuk penilaian ini ikut terhapus.`
    )
    if (!ok) return
    const supabase = createClient()
    const { error } = await supabase.from('penilaian_items').delete().eq('id', item.id)
    if (error) return fail('Gagal menghapus penilaian.')
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setScores((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([k]) => !k.startsWith(`${item.id}:`))
      )
    )
    setMessage({ text: `Penilaian "${item.title}" dihapus.`, ok: true })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Penilaian" value={items.length} tone="violet" />
        <StatCard
          label="Rata-rata kelas"
          value={classAvg ?? '-'}
          tone={classAvg === null ? 'sky' : classAvg >= 75 ? 'emerald' : 'amber'}
          hint="Dari persen nilai maksimal"
        />
        <StatCard
          label="Nilai tertinggi"
          value={top?.avg ?? '-'}
          tone="teal"
          hint={top?.name}
        />
        <StatCard
          label="Belum diisi"
          value={emptyCells}
          tone={emptyCells > 0 ? 'amber' : 'emerald'}
          hint="Kolom nilai kosong"
        />
      </div>

      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Tambah penilaian
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Contoh: Tugas HTML, Praktik Laravel, Keaktifan. Kamu bisa menambah
          atau menghapus kapan saja.
        </p>
        <form onSubmit={addItem} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label htmlFor="item-title" className="mb-1 block text-xs font-medium text-slate-500">
              Nama penilaian
            </label>
            <input
              id="item-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              maxLength={80}
              required
              placeholder="Tugas HTML"
              className={inputClass}
            />
          </div>
          <div className="w-28">
            <label htmlFor="item-max" className="mb-1 block text-xs font-medium text-slate-500">
              Nilai maks.
            </label>
            <input
              id="item-max"
              value={newMax}
              onChange={(e) => setNewMax(e.target.value)}
              inputMode="decimal"
              maxLength={6}
              required
              className={inputClass}
            />
          </div>
          <PrimaryButton type="submit" disabled={adding} className="sm:w-auto">
            {adding ? 'Menyimpan...' : '+ Tambah'}
          </PrimaryButton>
        </form>
        <p
          role="status"
          aria-live="polite"
          className={`mt-2 min-h-5 text-sm ${message?.ok ? 'text-emerald-600' : 'text-red-500'}`}
        >
          {message?.text}
        </p>
      </Card>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Nilai per siswa
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Ketik nilai lalu tekan Enter atau pindah kolom, otomatis tersimpan.
          Kosongkan untuk menghapus. Rata-rata dihitung dari persen nilai
          maksimal.
        </p>

        {items.length === 0 ? (
          <Card className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Belum ada penilaian. Tambahkan dulu di atas.
            </p>
          </Card>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="sticky left-0 z-10 min-w-[200px] bg-slate-50 px-4 py-3 font-medium dark:bg-slate-800">
                    Siswa
                  </th>
                  {items.map((item) => (
                    <th key={item.id} className="min-w-[110px] px-2 py-3 text-center font-medium">
                      <div className="flex items-start justify-center gap-1">
                        <div className="min-w-0">
                          <p className="max-w-[9rem] truncate text-slate-700 dark:text-slate-200" title={item.title}>
                            {item.title}
                          </p>
                          <p className="text-[11px] font-normal text-slate-400">
                            maks {item.max_score}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          aria-label={`Hapus penilaian ${item.title}`}
                          className="rounded px-1 text-base leading-none text-slate-300 transition hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="min-w-[96px] px-4 py-3 text-center font-medium">Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={items.length + 2} className="px-4 py-8 text-center text-slate-400">
                      Belum ada siswa aktif.
                    </td>
                  </tr>
                ) : (
                  rows.map((s) => (
                    <tr key={s.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="sticky left-0 z-10 bg-white px-4 py-2 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} />
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      {items.map((item) => {
                        const key = scoreKey(item.id, s.id)
                        const value = scores[key]
                        const tone =
                          value === undefined
                            ? null
                            : levelTone(scorePercent(value, item.max_score))
                        return (
                          <td key={item.id} className="px-2 py-2 text-center">
                            <input
                              key={`${key}:${value ?? ''}`}
                              defaultValue={value ?? ''}
                              inputMode="decimal"
                              maxLength={6}
                              aria-label={`${s.name}: ${item.title}`}
                              aria-invalid={errorKey === key}
                              onBlur={(e) => saveScore(item, s, e.currentTarget.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') e.currentTarget.blur()
                              }}
                              className={`w-20 rounded-lg border px-2 py-1.5 text-center text-sm tabular-nums outline-none transition focus:ring-2 focus:ring-sky-100 dark:bg-slate-950 dark:text-slate-100 ${
                                errorKey === key
                                  ? 'border-red-400 ring-2 ring-red-100'
                                  : tone
                                    ? `border-transparent ring-1 ring-inset ${LEVEL_CLASSES[tone].chip}`
                                    : 'border-slate-200 bg-white dark:border-slate-700'
                              }`}
                            />
                          </td>
                        )
                      })}
                      <td className="px-4 py-2 text-center">
                        <AvgChip value={s.avg} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <td className="sticky left-0 z-10 bg-slate-50 px-4 py-2.5 font-medium dark:bg-slate-800">
                    Rata-rata penilaian
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="px-2 py-2.5 text-center">
                      <AvgChip value={itemAverage(item, studentIds, scores)} />
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-center">
                    <AvgChip value={classAvg} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}