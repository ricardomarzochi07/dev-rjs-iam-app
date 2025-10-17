import { UserType } from "@/types/signup/user_type";

export interface ValidationResult {
  valid: boolean;
  messages?: Record<string, string>;
}

// ✅ EMAIL
export const validateEmail = (
  email: string,
  t: (key: string) => string
): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, messages: { emailError: t("validation.emailInvalid") } };
  }
  return { valid: true };
};

// ✅ NAME (firstName + lastName)
export const validateName = (
  form: UserType,
  t: (key: string) => string
): ValidationResult => {
  let errorMessage = "";

  if (!form.firstName || form.firstName.trim().length < 3 ||
  !form.lastName || form.lastName.trim().length < 3) {
    errorMessage = t("validation.firstNameMin");
  }

  return errorMessage
    ? { valid: false, messages: { namesError: errorMessage } }
    : { valid: true };
};

// ✅ USERNAME
export const validateUsername = (
  form: UserType,
  t: (key: string) => string
): ValidationResult => {
  const username = form.username?.trim();
  if (!username || username.length < 3 || username.length > 20) {
    return { valid: false, messages: { usernameError: t("validation.usernameLength") } };
  }
  return { valid: true };
};

// ✅ PASSWORD
export const validatePassword = (
  password: string,
  passwordConfirm: string,
  t: (key: string) => string
): ValidationResult => {
  let errorMessage = "";

  if (password !== passwordConfirm) {
    errorMessage = t("validation.passwordMismatch");
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!regex.test(password)) {
    errorMessage = errorMessage
      ? `${errorMessage} ${t("validation.passwordWeak")}`
      : t("validation.passwordWeak");
  }

  return errorMessage
    ? { valid: false, messages: { passwordError: errorMessage } }
    : { valid: true };
};

// ✅ GENDER
export const validateGender = (
  gender: string,
  t: (key: string) => string
): ValidationResult => {
  if (!gender) {
    return { valid: false, messages: { genderError: t("validation.genderRequired") } };
  }
  return { valid: true };
};
