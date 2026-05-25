export const VALIDATION_PATTERNS = {
  NAME: '^[A-Za-z ]+$',
  PASSWORD_PATTERN: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$',
  PHONE: '^[0-9]{10}$'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  PASSWORD_PATTERN: 'Must contain at least 8 characters, including uppercase, lowercase, number, and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  FORM_INVALID: 'Please fix validation errors',  
  NAME: 'Only letters allowed',
  EMAIL: 'Invalid email format',
  LOGIN_ID: 'Must be 8–20 characters',
  PHONE: 'Must be exactly 10 digits',
};