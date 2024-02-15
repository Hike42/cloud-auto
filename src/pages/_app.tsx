import "../styles/globals.css"; // Assurez-vous que le chemin est correct
import type { AppProps } from "next/app";
import { AuthProvider } from "../auth"; // Ajustez le chemin vers votre AuthProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
