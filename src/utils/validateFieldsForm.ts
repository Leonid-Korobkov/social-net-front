export const validatePassword = {
  minLength: (value: string) => value.length >= 6 || 'Минимум 6 символов',
  maxLength: (value: string) => value.length <= 24 || 'Максимум 24 символа',
  hasUppercase: (value: string) =>
    /[A-Z]/.test(value) || 'Минимум 1 большая буква',
  hasLowercase: (value: string) =>
    /[a-z]/.test(value) || 'Минимум 1 маленькая буква',
  hasNumber: (value: string) => /\d/.test(value) || 'Минимум 1 цифра',
  hasSpecial: (value: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Минимум 1 спецсимвол',
}

export const validateEmailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

export const validateUserName = {
  minLength: (value: string) =>
    value.length >= 3 || 'Имя пользователя должно содержать минимум 3 символа',
  maxLength: (value: string) =>
    value.length <= 15 ||
    'Имя пользователя должно содержать максимум 15 символов',
  allowedCharacters: (value: string) =>
    /^[a-z0-9_.-]+$/.test(value) ||
    'Имя пользователя может содержать только латинские буквы, цифры и символы _, -, .',
  notOnlySpecialChars: (value: string) =>
    !/^[._-]+$/.test(value) ||
    'Имя пользователя не может состоять только из символов _, ., или -',
  cannotStartWithDotOrDash: (value: string) =>
    !/^[.-]/.test(value) ||
    'Имя пользователя не может начинаться с точки или дефиса',
  cannotEndWithDotOrDash: (value: string) =>
    !/[.-]$/.test(value) ||
    'Имя пользователя не может заканчиваться на точку или дефис',
  cannotHaveConsecutiveDotsOrDashes: (value: string) =>
    !/[.-]{2}/.test(value) ||
    'Имя пользователя не может содержать две точки или дефиса подряд',
}
