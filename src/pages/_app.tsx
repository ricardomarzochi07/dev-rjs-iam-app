import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { initI18n, I18nextProvider, i18n } from 'buddybets-i18n-lib';

// Inicializa i18n fuera del componente, seguro de llamar varias veces
initI18n();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}

/*
export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initI18n(); // solo corre en cliente después del mount
  }, []);

  return <Component {...pageProps} />;
}
  */