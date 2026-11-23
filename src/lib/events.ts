export type EventTimeStatus = 'this-week' | 'this-month' | 'upcoming' | 'past'

export function getEventTimeStatus(date: string, end_date?: string): EventTimeStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekLater = new Date(today)
  weekLater.setDate(today.getDate() + 7)

  const startDate = new Date(date)
  const endDate = end_date ? new Date(end_date) : new Date(date)
  endDate.setHours(23, 59, 59)

  if (endDate < today) return 'past'
  if (startDate <= weekLater) return 'this-week'
  if (
    startDate.getMonth() === today.getMonth() &&
    startDate.getFullYear() === today.getFullYear()
  )
    return 'this-month'
  return 'upcoming'
}
