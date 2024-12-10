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

export const formatDateToISO = (dateString: string | undefined | Date): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const dateString = '2005-12-12T00:00:00.000Z'
const formattedDate = formatDateToISO(dateString)

console.log(formattedDate) // "2005-12-12"
