// Shared form validation helpers — used by SignIn, SignUp, and Contact

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_REGEX.test(value);