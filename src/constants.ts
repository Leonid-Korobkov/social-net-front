export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://zling-api.up.railway.app'
    : import.meta.env.VITE_BASE_URL
