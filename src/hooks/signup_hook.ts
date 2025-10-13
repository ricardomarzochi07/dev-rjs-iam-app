// hooks/useSignupForm.ts
import { useState } from "react";
import { UserType } from "@/types/signup/user_type";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
} from "@/utils/validation";

export function signupHook(initialState: UserType) {
  const [form, setForm] = useState(initialState);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const usernameValue = emailValue.split("@")[0].trim();
    setForm(prev => ({ ...prev, email: emailValue, username: usernameValue }));
  };

  const validate = (): boolean => {
    let newErrors: Record<string, string> = {};

    const nameErrors = validateName(form);
    if (nameErrors.error && nameErrors.messages) {
      newErrors.namesError = Object.values(nameErrors.messages).join("\n");
    }

    const usernameErrors = validateUsername(form);
    if (usernameErrors.error && usernameErrors.messages) {
      newErrors.usernameError = Object.values(usernameErrors.messages).join("\n");
    }

    if (!validateEmail(form.email)) {
      newErrors.emailError = "Email inválido";
    }

    if (!form.gender) {
      newErrors.genderError = "Seleccione un género";
    }

    const passValidation = validatePassword(form.password, passwordConfirm);
    if (!passValidation.valid) {
      newErrors.passwordError = passValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    form,
    setForm,
    handleChange,
    handleEmailChange,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    setErrors,
    validate,
  };
}
