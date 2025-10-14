import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { initI18n, useLanguage } from 'buddybets-i18n-lib';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initI18n(); // solo corre en cliente después del mount
  }, []);

  return <Component {...pageProps} />;
}