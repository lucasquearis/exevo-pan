const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()

  return `${month}/${day}/${year}`
}

export const getDaysUntilAuctionEnd = (auctionEnd: number): string[] => {
  const formatedEndDate = formatDate(auctionEnd * 1000)
  const formatedCurrentDate = formatDate(+new Date())

  const endDate = new Date(formatedEndDate)
  const currentDate = new Date(formatedCurrentDate)
  const daysInRange = [formatedCurrentDate]
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1)
    daysInRange.push(formatDate(+currentDate))
  }

  return daysInRange
}

export const fillWithDays = (
  initialDateString: string,
  amount: number,
  step: number,
): string[] => {
  const currentDate = new Date(initialDateString)

  return Array.from(
    { length: amount },
    () => +currentDate.setDate(currentDate.getDate() + step),
  )
    .sort((a, b) => a - b)
    .map(formatDate)
}
