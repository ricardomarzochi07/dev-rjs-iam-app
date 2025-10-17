import { useState } from "react";
import { UserType } from "@/types/signup/user_type";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
  validateGender,
} from "@/utils/validation";

// ✅ Tipo de errores para un registro de campo -> mensaje
export type SignupErrors = Record<string, string | null>;

/**
 * Hook de registro con validación y soporte multilenguaje
 */
export function signupHook(initialState: UserType, t: (key: string) => string) {
  const [form, setForm] = useState<UserType>(initialState);
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errors, setErrors] = useState<SignupErrors>({});

  /** 🔹 Setea un error individual */
  const setErrorField = (field: string, message: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  };

  /** 🔹 Actualiza los valores del formulario y limpia errores del campo */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpia error del campo modificado
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  /** 🔹 Actualiza email y autocompleta username */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const usernameValue = emailValue.split("@")[0].trim();
    setForm(prev => ({ ...prev, email: emailValue, username: usernameValue }));
    // Limpia errores asociados
    setErrors(prev => ({
      ...prev,
      email: null,
      username: null,
    }));
  };

  /** 🔹 Validación global del formulario */
  const validate = (): boolean => {
    setErrors({});
    let newErrors: SignupErrors = {};

    // 🧩 Nombre y Apellido
    const nameResult = validateName(form, t);
    if (!nameResult.valid && nameResult.messages) {
      newErrors = { ...newErrors, ...nameResult.messages };
    }

    // 🧩 Username
    const usernameResult = validateUsername(form, t);
    if (!usernameResult.valid && usernameResult.messages) {
      newErrors = { ...newErrors, ...usernameResult.messages };
    }

    // 🧩 Email
    const emailResult = validateEmail(form.email, t);
    if (!emailResult.valid && emailResult.messages) {
      newErrors = { ...newErrors, ...emailResult.messages };
    }

    // 🧩 Género
    const genderResult = validateGender(form.gender, t);
    if (!genderResult.valid && genderResult.messages) {
      newErrors = { ...newErrors, ...genderResult.messages };
    }

    // 🧩 Contraseña
    const passwordResult = validatePassword(form.password, passwordConfirm, t);
    if (!passwordResult.valid && passwordResult.messages) {
      newErrors = { ...newErrors, ...passwordResult.messages };
    }

    // 🔧 Actualiza el estado de errores
    setErrors({ ...newErrors });

    // ✅ Devuelve true si no hay errores
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
    setErrorField,
    validate,
  };
}
