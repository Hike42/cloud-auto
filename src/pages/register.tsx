import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../utils/firebaseConfig"; // Ajustez le chemin
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router"; // Importez useRouter

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Créez une instance de useRouter

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      setError("Veuillez sélectionner un rôle.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Compte créé avec succès", userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role,
      });

      router.push("/"); // Redirection vers la page d'accueil
    } catch (error) {
      setError(
        "Erreur lors de la création du compte. Veuillez vérifier les informations fournies."
      );
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg max-w-md">
        <h3 className="text-2xl font-bold text-center">Créer un compte</h3>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mt-4">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="role">
              Rôle
            </label>
            <select
              id="role"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Sélectionner un rôle</option>
              <option value="client">Client</option>
              <option value="vendeur">Vendeur</option>
            </select>
          </div>
          <div className="flex items-baseline justify-between">
            <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
              S'inscrire
            </button>
          </div>
          <div>
            <p className="mt-4">
              Vous avez déjà un compte ?{" "}
              <a href="/" className="text-blue-600">
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
