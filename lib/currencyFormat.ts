export const currencyFormat = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export const currencyReformat = (
  number: string,
  min: number = 0,
  max: number = 999999999
) => {
  const cleanedValue = number.replace(/[^0-9]/g, "")

  const numberValue = Math.min(Math.max(Number(cleanedValue), min), max) | min

  const formattedValue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(numberValue)
    .replace(/^Rp\s?/, "")

  return formattedValue
}

export const cleanFormat = (
  number: string,
  min: number = 0,
  max: number = 999999999
) => {
  const cleanedValue = number.replace(/[^0-9]/g, "")

  const numberValue = Math.min(Math.max(Number(cleanedValue), min), max) | min

  return numberValue
}
