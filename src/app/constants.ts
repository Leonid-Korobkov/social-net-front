export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://zling-api.up.railway.app'
    : process.env.NEXT_PUBLIC_BASE_URL

console.log(process.env.NEXT_PUBLIC_BASE_URL)
export const APP_URL = 'https://zling.up.railway.app'
