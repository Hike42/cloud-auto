import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebaseConfig"; // Ajustez le chemin
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "../auth"; // Ajustez le chemin

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser, role } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Connexion réussie");

      // Récupérer les informations supplémentaires de l'utilisateur, y compris le rôle
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Stocker les informations de l'utilisateur, y compris le rôle, dans l'état global ou le contexte
        setUser({
          ...userCredential.user,
          role: userData.role, // Ajouter le rôle à l'objet utilisateur
        } as User & { role: string }); // Update the type of User object to include the role property

        router.push("/home"); // Redirigez vers la page souhaitée après la connexion
      } else {
        console.error("Aucunes données utilisateur trouvées dans Firestore");
        setError(
          "Erreur lors de la récupération des informations de l'utilisateur."
        );
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer plus tard.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 text-left bg-white shadow-lg max-w-md">
        <h3 className="text-2xl font-bold text-center">Connexion</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-baseline justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:bg-blue-300"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
          <div className="mt-4">
            Vous n'avez pas de compte ?{" "}
            <Link href="/register">
              <p className="flex text-blue-600 justify-center">S'inscrire</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
