export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL

export const BACKEND_URL_FOR_WEBPUSH =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL_FOR_WEBPUSH
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL_FOR_WEBPUSH

export const BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_BACKEND_URL
    : process.env.DEV_BACKEND_URL

export const BACKEND_URL_FOR_OG =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_BACKEND_URL_OG
    : process.env.DEV_BACKEND_URL_OG

export const APP_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_FRONTEND_URL
    : process.env.NEXT_PUBLIC_DEV_FRONTEND_URL

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
