'use client'

import { useLocale } from '@/components/locale-provider'
import type { TranslationKey } from '@/lib/i18n'

export default function PageHeading({
  titleKey,
  descKey,
}: {
  titleKey: TranslationKey
  descKey?: TranslationKey
}) {
  const { t } = useLocale()
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {t(titleKey)}
      </h1>
      {descKey ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          {t(descKey)}
        </p>
      ) : null}
    </div>
  )
}