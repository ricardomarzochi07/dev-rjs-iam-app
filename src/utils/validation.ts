// src/utils/validation.ts

import { UserType } from '@/types/signup/user_type';

export interface PasswordValidationResult {
  valid: boolean;
  message: string;
}

// ✅ Validación de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Validación de nombres (firstName y lastName)
export const validateName = (form: UserType) => {
  const errors: { firstName?: string; lastName?: string } = {};

  if (!form.firstName || form.firstName.trim().length < 3) {
    errors.firstName = 'First name must be at least 3 characters';
  }

  if (!form.lastName || form.lastName.trim().length < 3) {
    errors.lastName = 'Last name must be at least 3 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { error: true, messages: errors };
  }

  return { error: false };
};

// ✅ Validación de password y confirmación
export const validatePassword = (
  password: string,
  passwordConfirm: string
): PasswordValidationResult => {
  if (password !== passwordConfirm) {
    return { valid: false, message: 'Passwords do not match' };
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!regex.test(password)) {
    return {
      valid: false,
      message:
        'Password must have min 8 chars, uppercase, lowercase, number and special character',
    };
  }

  return { valid: true, message: 'Valid password' };
};

// ✅ Validación de username
export const validateUsername = (form: UserType) => {
  const errors: { username?: string } = {};
  const username = form.username?.trim();

  if (!username || username.length < 3 || username.length > 20) {
    errors.username = 'Username must be 3–20 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return { error: true, messages: errors };
  }

  return { error: false };
};
