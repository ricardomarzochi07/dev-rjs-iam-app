import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { StatusCodes } from 'http-status-codes';
import styles from '@/components/Signup/signup.module.css';
import Image from 'next/image';
import stadium from "@/assets/images/chat_estadio1.png";
import fan from "@/assets/images/cavas_torcedor03.png";
import ReCAPTCHA from "react-google-recaptcha";
import SignupForm from "@/components/Signup/signup_form";
import { TransactionService } from "@/services/transaction_service";
import { UserType } from "@/types/signup/user_type";
import { signupHook } from "@/hooks/signup_hook";
import { useTranslation} from "react-i18next"

const initialFormState: UserType = {
  firstName: '',
  lastName: '',
  gender: '',
  email: '',
  username: '',
  password: '',
  captcha_token: '',
  jwt_nonce: '',
  jwt_csrf: '',
};

interface SignupInitResponse {
  jwt_nonce: string;
  captcha_token: string;
  jwt_csrf: string;
}

export default function SignupPage() {
  const navigate = useRouter();
  const { t } = useTranslation();

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
  } = signupHook(initialFormState);

  const [signupInit, setSignupInit] = useState<SignupInitResponse | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [errorInit, setErrorInit] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  /** Obtener tokens iniciales */
  useEffect(() => {
    const fetchSignupInit = async () => {
      setLoadingInit(true);
      try {
        const response = await TransactionService.getSignupInit();
        if (!response.success) {
          setErrorInit(response.message ?? "Error de inicialización");
          return;
        }

        const initData = response.data;
        setSignupInit(initData);

        // Actualizar form con tokens jwt
        // Como el hook no expone setForm, vamos a agregarlo (o actualizarlo aquí)
        // Por simplicidad, asumimos que useSignupForm expone setForm:
        // setForm(prev => ({
        //   ...prev,
        //   jwt_nonce: initData.jwt_nonce ?? '',
        //   jwt_csrf: initData.jwt_csrf ?? '',
        // }));

        // Si no quieres exponer setForm, se puede hacer en el hook con un método aparte.
        setForm(f => ({
          ...f,
          jwt_nonce: initData.jwt_nonce ?? '',
          jwt_csrf: initData.jwt_csrf ?? '',
        }));

      } catch (err: any) {
        setErrorInit(err.message ?? "Error al inicializar el registro");
      } finally {
        setLoadingInit(false);
      }
    };

    fetchSignupInit();
  }, []);

  // ** Necesitamos exponer `setForm` en el hook para hacer esto **
  // Agrega `setForm` al hook exportado si no lo tienes.

  // handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiamos errores de captcha para que se refresque si hay
    setErrors(prev => ({ ...prev, captchaError: null, registerError: null }));

    if (!validate()) return;

    if (!form.captcha_token) {
      setErrors(prev => ({ ...prev, captchaError: "Debe completar el captcha" }));
      return;
    }

    setLoadingSubmit(true);

    try {
      const response = await TransactionService.postRegisterSignupSubmit(form);

      if (!response.success) {
        if (response.code === StatusCodes.CONFLICT) {
          setErrors(prev => ({ ...prev, usernameError: response.message ?? null }));
          return;
        }

        if (response.code === StatusCodes.UNAUTHORIZED || response.code >= 500) {
          setErrors(prev => ({ ...prev, registerError: response.message ?? null }));
          return;
        }
      }

      if (response.success && response.code === 200) {
        navigate.push('/login');
      }
    } catch (err: any) {
      alert(err.message || "Error al registrar el usuario");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInit) {
    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}></div>
        <p>Load Page ...</p>
      </div>
    );
  }

  if (errorInit) {
    return (
      <div className={styles.errorWrapper}>
        <h2>❌ Error initializing the page</h2>
        <p>{errorInit}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} style={{ backgroundImage: `url(${stadium.src})` }}>
      <div className={styles.inner}>
        <div className={styles.imageHolder}>
          <img src={fan.src} alt="Fan" className={styles.image} />
        </div>
      

        <form onSubmit={handleSubmit}>
          <h3>User Registration</h3>
  
          {errors.registerError && 
          <div className={styles.errorMessage}>{errors.registerError}</div>}
          <br></br>

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
                onChange={(token) => {
                  setForm(f => ({ ...f, captcha_token: token ?? '' }));
                }}
              />
              {errors.captchaError && <div className={styles.errorMessage}>{errors.captchaError}</div>}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingSubmit}
            className={styles.submitButton}
          >
            {loadingSubmit ? (
              <>
                <i className="zmdi zmdi-spinner zmdi-hc-spin"></i> Registrando...
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
          <p>{t("signup.register")} </p>
        </div>
      )}
    </div>
  );
}
