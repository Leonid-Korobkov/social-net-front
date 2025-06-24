// Форматирует число в сокращённый вид с учётом локали
// Например: 1.2K, 3.4M (en); 1,2 тыс., 3,4 млн (ru)
export function formatNumberShort(
  value: number,
  locale: string = typeof navigator !== 'undefined' ? navigator.language : 'en'
): string {
  if (locale.startsWith('ru')) {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1).replace('.', ',')} млн`
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1).replace('.', ',')} тыс.`
    }
    return value.toString()
  } else {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    }
    return value.toString()
  }
}
