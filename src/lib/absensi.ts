export function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

export function formatSessionDate(
  iso: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', options)
}