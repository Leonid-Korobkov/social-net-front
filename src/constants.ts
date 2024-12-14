export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://social-net-back.onrender.com'
    : import.meta.env.VITE_BASE_URL
