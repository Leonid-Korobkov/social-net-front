export const formatToClientDate = (date: Date, withTime = true) => {
  if (!date) return ''

  if (!withTime) return new Date(date).toLocaleDateString('ru-RU')

  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
}

export const formatDateToISO = (
  dateString: string | undefined | Date,
): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
