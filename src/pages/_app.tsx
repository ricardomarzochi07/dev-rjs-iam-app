import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { I18nProvider } from 'buddybets-i18n-lib';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  );
}