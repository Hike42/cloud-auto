import '../styles/globals.css'; // Assurez-vous que le chemin est correct
import type { AppProps } from 'next/app';
import { AuthProvider } from '../auth'; // Ajustez le chemin vers votre AuthProvider
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Cloud Car</title>
        <meta name="description" content="Marketplace" />
        <link rel="icon" href="/car.png" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
