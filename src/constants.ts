export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.VITE_PROD_URL
    : import.meta.env.VITE_BASE_URL
