import styles from "./signup.module.css"; // Reutiliza tu CSS existente
import { FaLock, FaLockOpen } from "react-icons/fa"; // candado cerrado / abierto
import { useLanguage } from "buddybets-i18n-lib"

type Props = {
  form: any;
  errors: Record<string, string | null>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleEmailChange: (e: React.ChangeEvent<any>) => void;
  passwordConfirm: string;
  setPasswordConfirm: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
};

export default function SignupForm({
  form,
  errors,
  handleChange,
  handleEmailChange,
  passwordConfirm,
  setPasswordConfirm,
  showPassword,
  setShowPassword,
}: Props) {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  return (
    <>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder={t("signup.firstName")}
          className={styles.formControl}
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder={t("signup.lastName")}
          className={styles.formControl}
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
      </div>
      {errors.namesError && <div className={styles.errorMessage}>{errors.namesError}</div>}

      <div className={styles.formWrapper}>
        <input
          type="text"
          placeholder={t("signup.email")}
          className={styles.formControl}
          name="email"
          value={form.email}
          onChange={handleEmailChange}
        />
        {errors.emailError && <div className={styles.errorMessage}>{errors.emailError}</div>}
      </div>

      <div className={styles.formWrapper}>
        <input
          type="text"
          placeholder={t("signup.username")}
          className={styles.formControl}
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        {errors.usernameError && <div className={styles.errorMessage}>{errors.usernameError}</div>}
      </div>

      <div className={styles.formWrapper}>
        <select
          name="gender"
          className={styles.formControl}
          value={form.gender}
          onChange={handleChange}
        >
          <option value="" disabled>{t("signup.gender")}</option>
          <option value="male">{t("signup.genderMale")}</option>
          <option value="female">{t("signup.genderFemale")}</option>
          <option value="other">{t("signup.genderOther")}</option>
        </select>
        {errors.genderError && <div className={styles.errorMessage}>{errors.genderError}</div>}
      </div>

      <div className={styles.formWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("signup.password")}
          className={styles.formControl}
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("signup.confirmPassword")}
          className={styles.formControl}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.showPasswordButton}
          aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <FaLockOpen /> : <FaLock />}
        </button>
        {errors.passwordError && <div className={styles.errorMessage}>{errors.passwordError}</div>}
      </div>
    </>
  );
}
