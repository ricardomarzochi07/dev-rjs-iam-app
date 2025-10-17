import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { StatusCodes } from "http-status-codes";
import ReCAPTCHA from "react-google-recaptcha";

import styles from "@/components/Signup/signup.module.css";
import stadium from "@/assets/images/chat_estadio1.png";
import fan from "@/assets/images/cavas_torcedor03.png";

import SignupForm from "@/components/Signup/signup_form";
import { TransactionService } from "@/services/transaction_service";
import { UserType } from "@/types/signup/user_type";
import { signupHook } from "@/hooks/signup_hook";
import { useLanguage } from "buddybets-i18n-lib";

// 🔹 Estado inicial del formulario
const initialFormState: UserType = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  username: "",
  password: "",
  captcha_token: "",
  jwt_nonce: "",
  jwt_csrf: "",
};

// 🔹 Tipo para respuesta de inicialización
interface SignupInitResponse {
  jwt_nonce: string;
  captcha_token: string;
  jwt_csrf: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const {
    form,
    setForm,
    handleChange,
    handleEmailChange,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    setErrors,
    validate,
  } = signupHook(initialFormState, t);

  const [signupInit, setSignupInit] = useState<SignupInitResponse | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [errorInit, setErrorInit] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** 🧩 Inicialización del registro */
  useEffect(() => {
    const fetchSignupInit = async () => {
      setLoadingInit(true);
      try {
        const response = await TransactionService.getSignupInit();
        if (!response.success) {
          setErrorInit(response.message ?? t("error.initFailed"));
          return;
        }

        const initData = response.data;
        setSignupInit(initData);

        // ✅ Añadimos los tokens al form
        setForm(prev => ({
          ...prev,
          jwt_nonce: initData.jwt_nonce ?? "",
          jwt_csrf: initData.jwt_csrf ?? "",
        }));
      } catch (err: any) {
        setErrorInit(err.message ?? t("error.initFailed"));
      } finally {
        setLoadingInit(false);
      }
    };

    fetchSignupInit();
  }, [setForm, t]);

  /** 🧩 Envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, captchaError: null, registerError: null }));

    // ✅ Validaciones
    if (!validate()) return;

    if (!form.captcha_token) {
      setErrors(prev => ({ ...prev, captchaError: t("validation.captchaRequired") }));
      return;
    }

    setLoadingSubmit(true);

    try {
      const response = await TransactionService.postRegisterSignupSubmit(form);

      if (!response.success) {
        if (response.code === StatusCodes.CONFLICT) {
          setErrors(prev => ({ ...prev, usernameError: response.message ?? "" }));
          return;
        }

        if (response.code === StatusCodes.UNAUTHORIZED || response.code >= 500) {
          setErrors(prev => ({ ...prev, registerError: response.message ?? "" }));
          return;
        }
      }

      // ✅ Registro exitoso → redirigir
      if (response.success && response.code === 200) {
        router.push("/login");
      }
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        registerError: err.message || t("error.generic"),
      }));
    } finally {
      setLoadingSubmit(false);
    }
  };

  /** 🌀 Estado: cargando inicialización */
  if (loadingInit) {
    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}></div>
        <p>{t("status.loadingPage")}</p>
      </div>
    );
  }

  /** ❌ Estado: error al inicializar */
  if (errorInit) {
    return (
      <div className={styles.errorWrapper}>
        <h2>❌ {t("status.stInitialization")}</h2>
        <p>{errorInit}</p>
        <button onClick={() => window.location.reload()}>
          {t("actions.retry")}
        </button>
      </div>
    );
  }

  /** 🧩 Render principal */
  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: `url(${stadium.src})` }}
    >
      <div className={styles.inner}>
        <div className={styles.imageHolder}>
          <img src={fan.src} alt="Fan" className={styles.image} />
        </div>

        <form onSubmit={handleSubmit}>
          <h3>{t("signup.title")}</h3>

          {errors.registerError && (
            <div className={styles.errorMessage}>{errors.registerError}</div>
          )}

          <SignupForm
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleEmailChange={handleEmailChange}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {signupInit && (
            <div className={styles.recaptchaWrapper}>
              <ReCAPTCHA
                sitekey={signupInit.captcha_token}
                onChange={token => {
                  setForm(prev => ({ ...prev, captcha_token: token ?? "" }));
                }}
              />
              {errors.captchaError && (
                <div className={styles.errorMessage}>{errors.captchaError}</div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingSubmit}
            className={styles.submitButton}
          >
            {loadingSubmit ? (
              <>
                <i className="zmdi zmdi-spinner zmdi-hc-spin"></i>{" "}
                {t("status.stSignup")}
              </>
            ) : (
              <>
                {t("signup.register")} <i className="zmdi zmdi-arrow-right"></i>
              </>
            )}
          </button>
        </form>
      </div>

      {loadingSubmit && (
        <div className={styles.overlay}>
          <div className={styles.spinner}></div>
          <p>{t("signup.register")}...</p>
        </div>
      )}
    </div>
  );
}
