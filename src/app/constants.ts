export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_BASE_URL

export const APP_URL = process.env.NEXT_PUBLIC_PROD_FRONTEND_URL
