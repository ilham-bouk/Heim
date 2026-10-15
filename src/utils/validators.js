// Shared form validation helpers — used by SignIn, SignUp, and Contact

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_REGEX.test(value);

/** Only http(s) links: rejects `javascript:` and other schemes before they reach an href. */
export const isValidHttpUrl = (value) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};