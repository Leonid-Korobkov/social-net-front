export const validatePassword = {
  minLength: (value: string) => value.length >= 6 || 'Минимум 6 символов',
  maxLength: (value: string) => value.length <= 16 || 'Максимум 16 символов',
  hasUppercase: (value: string) =>
    /[A-Z]/.test(value) || 'Минимум 1 большая буква',
  hasLowercase: (value: string) =>
    /[a-z]/.test(value) || 'Минимум 1 маленькая буква',
  hasNumber: (value: string) => /\d/.test(value) || 'Минимум 1 цифра',
  hasSpecial: (value: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Минимум 1 спецсимвол',
}

export const validateEmailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
